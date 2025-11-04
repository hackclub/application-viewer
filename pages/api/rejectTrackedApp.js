import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import slackReact from "../../utils/slackReact";
import slackPostMessage from "../../utils/slackPostMessage";
import transcript from "../../utils/transcript";
import { checkEmail, sendVerification, sendEmail } from "../../utils/email";

export default async (req, res) => {
  const { recordID, rejectionReason, email } = req.body

  try {
    ensureMethod({ req, method: 'POST' })

    const emailVerified = await checkEmail({ address: email.from })
    if (!emailVerified) {
      await sendVerification({ address: email.from })
      res.send({ ok: false, err: 'verify email', email: email.from})
      return
    }

    const clubRecord = await airtable.find('Clubs', recordID)

    const currentEntryNote = clubRecord.fields["notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nRejected: ${rejectionReason || "reject"}`
      : `Rejected: ${rejectionReason || "reject"}`

    const promises = []
    promises.push(airtable.patch('Clubs', recordID, {
      "notes": note,
      "Application Status": "rejected"
    }))

    // send email
    promises.push(sendEmail(email));

    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const tsMatch = currentEntryNote?.match(/Slack TS: (\d+\.\d+)/)
    const timestamp = tsMatch ? tsMatch[1] : null
    if (timestamp) {
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
