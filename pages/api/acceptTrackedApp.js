import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import createSlackChannel from "../../utils/createSlackChannel";
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

    const channelID = await createSlackChannel(recordID);

    const trackedApp = await airtable.find('Application Tracker', recordID)

    const currentEntryNote = trackedApp.fields["Notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nUpdated with webhook: accept`
      : `Updated with webhook: accept`

    email.message = email.message
      .replace('%SLACK_URL%', `https://app.slack.com/client/T0266FRGM/${channelID}`)

    const promises = []
    promises.push(airtable.patch('Application Tracker', recordID, {
      "Notes": note,
      "Status": "awaiting onboarding",
      "Slack Channel ID": channelID,
      "Date Responded": new Date().toISOString().slice(0, 10)
    }))

    promises.push(sendEmail(email));

    // update slack thread
    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const timestamp = trackedApp.fields["Application Committee Timestamp"];
    if (timestamp) {
      // applications created before #application-conspiracy was created don't have this field
      promises.push(slackReact({channel, timestamp, name: 'white_check_mark'}))
      promises.push(slackReact({channel, timestamp, name: 'no_entry', addOrRemove: 'remove'}))
      promises.push(slackPostMessage({channel, timestamp, text: transcript('application-committee.accepted', {channel: channelID})}))
    }

    await Promise.all(promises)

    res.send({ ok: true })

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}
