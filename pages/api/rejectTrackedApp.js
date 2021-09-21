import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import sendEmail from "../../utils/sendEmail";
import slackReact from "../../utils/slackReact";
import slackPostMessage from "../../utils/slackPostMessage";
import transcript from "../../utils/transcript";
import { checkEmail } from "../../utils/ses";

export default async (req, res) => {
  const { recordID, teacher, email } = req.body

  try {
    ensureMethod({ req, method: 'POST' })

    const emailVerified = await checkEmail({ email: email.from })
    if (!emailVerified) {
      res.send({ ok: false, err: 'verify email', email: email.from})
      return
    }

    const trackedApp = await airtable.find('Application Tracker', recordID)

    const currentEntryNote = trackedApp.fields["Notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nUpdated with webhook: ${teacher ? "teacher" : "reject"}`
      : `Updated with webhook: ${teacher ? "teacher" : "reject"}`

    const promises = []
    promises.push(airtable.patch('Application Tracker', recordID, {
      "Notes": note,
      "Status": "rejected",
      "Date Responded": new Date().toISOString().slice(0, 10)
    }))

    // send email
    promises.push(sendEmail(email));

    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const timestamp = trackedApp.fields["Application Committee Timestamp"];
    if (timestamp) {
      // applications created before #application-conspiracy were created don't have this field
      promises.push(slackReact({channel, timestamp, name: 'no_entry'}))
      promises.push(slackReact({channel, timestamp, name: 'white_check_mark', addOrRemove: 'remove'}))
      promises.push(slackPostMessage({channel, timestamp, text: transcript('application-committee.rejected')}))
    }

    await Promise.all(promises)

    res.send({ ok: true })

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}
