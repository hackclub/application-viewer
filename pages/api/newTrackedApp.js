import airtable from '../../utils/airtable';
import ensureMethod from '../../utils/ensureMethod';
import slackPostMessage from '../../utils/slackPostMessage';
import transcript from '../../utils/transcript';

export default async (req, res) => {
  ensureMethod({ req, method: 'POST' })

  try {

    const { dbRecordID } = req.body

    // Fetch the club record from Clubs table
    const clubRecord = await airtable.find('Clubs', dbRecordID)
    if (!clubRecord) {
      res.status(404).send('Record not found')
      return
    }

    const appDB = clubRecord.fields

    // Check if already tracked (Application Status is set)
    if (appDB['Application Status']) {
      res.send(200)
      return
    }

    // Update the record to mark as tracked/applied
    await airtable.patch('Clubs', dbRecordID, {
      "Application Status": "applied",
    })

    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const text = transcript('application-committee.new-application', {
      url: `https://application-viewer.vercel.app/${dbRecordID}`,
      location: `${appDB['venue_address_city']}, ${appDB['venue_address_state']}`,
    })
    const slackMessage = await slackPostMessage({ channel, text })

    // Store the slack message timestamp in notes or a dedicated field
    await airtable.patch('Clubs', dbRecordID, {
      "notes": appDB['notes'] ? `${appDB['notes']}\nSlack TS: ${slackMessage.ts}` : `Slack TS: ${slackMessage.ts}`
    })

    res.send(200)
  } catch (err) {
    console.error(err)
    if (!res.headersSent) {
      res.status(500).send(err)
    }
  }
}