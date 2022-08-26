import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import slackReact from "../../utils/slackReact";
import slackPostMessage from "../../utils/slackPostMessage";
import transcript from "../../utils/transcript";
import { checkEmail, sendEmail, sendVerification } from "../../utils/email";

export default async (req, res) => {
  const { recordID, email } = req.body

  try {
    ensureMethod({ req, method: 'POST' })

    const emailVerified = await checkEmail({ address: email.from })
    if (!emailVerified) {
      await sendVerification({ address: email.from })
      res.send({ ok: false, err: 'verify email', email: email.from})
      return
    }

    const trackedApp = await airtable.find('Application Tracker', recordID)

    const currentEntryNote = trackedApp.fields["Notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nUpdated with webhook: accept`
      : `Updated with webhook: accept`

    const ambassadorFromPlus = (email) => {
      const [_, plus] = email.split('@')[0].split('+').toLowerCase()
      return {
        "hq": "HQ",
        "brasil": "Brasil",
        "apac": "APAC"
      }[plus]
    }

    const ambassadorFromAddress = (email) => {
      return {
        "holly@hackclub.com": 'HQ'
      }[email.toLowerCase()]
    }

    const ambassador = email.from.map(from => ambassadorFromPlus(from) || ambassadorFromAddress(from))[0]

    const promises = []
    let fields = {
      "Notes": note,
      "Status": "awaiting onboarding",
      "Date Responded": new Date().toISOString().slice(0, 10)
    }
    if (ambassador) {
      fields["Ambassador"] = ambassador
    }
    promises.push(airtable.patch('Application Tracker', recordID, fields))

    promises.push(sendEmail(email));

    // update slack thread
    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const timestamp = trackedApp.fields["Application Committee Timestamp"];
    if (timestamp) {
      // applications created before #application-conspiracy was created don't have this field
      promises.push(slackReact({ channel, timestamp, name: 'white_check_mark' }))
      promises.push(slackReact({ channel, timestamp, name: 'no_entry', addOrRemove: 'remove' }))
    }

    await Promise.all(promises)
    res.send({ ok: true })

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}
