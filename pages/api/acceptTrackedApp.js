import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import createSlackChannel from "../../utils/createSlackChannel";
import sendEmail from "../../utils/sendEmail";
import slackReact from "../../utils/slackReact";

export default async (req, res) => {
  const { recordID, email } = req.body

  try {
    ensureMethod({ req, method: 'POST' })

    const channelID = await createSlackChannel(recordID);

    const trackedApp = await airtable.find('Application Tracker', recordID)

    const currentEntryNote = trackedApp.fields["Notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nUpdated with webhook: accept`
      : `Updated with webhook: accept`

    email.content = email.content
      .replace('%SLACK_URL%', `https://app.slack.com/client/T0266FRGM/${channelID}`)

    // update record
    await airtable.patch('Application Tracker', recordID, {
      "Notes": note,
      "Status": "awaiting onboarding",
      "Slack Channel ID": channelID,
      "Date Responded": new Date().toISOString().slice(0, 10)
    })

    // send email
    await sendEmail(email);

    // update slack thread
    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const timestamp = trackedApp.fields["Application Committee Timestamp"];
    console.log(await slackReact({channel, timestamp, name: 'white_check_mark'}))
    console.log(await slackReact({channel, timestamp, name: 'no_entry', addOrRemove: 'remove'}))

    res.send({ ok: true })

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}