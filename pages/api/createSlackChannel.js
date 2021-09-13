import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";

const safeChannelName = (name) => {
  return name.replace(/[^a-z0-9]/gi, "_").slice(0, 80).toLowerCase();
}

export default async (req, res) => {
  // given an application recordID, create a slack channel & save it
  try {
    ensureMethod({req, method: 'POST'});

    const { recordID } = req.body;

    const application = await airtable.find('Application Tracker', recordID);

    console.log({fields: application.fields})
    if (!application.fields['Slack Channel'] || application.fields['Slack Channel'].length == 0) {
      const channelData = await fetch('https://slack.com/api/conversations.create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.BOUNCER_SLACK_TOKEN}`
        },
        body: JSON.stringify({
          name: safeChannelName(application.fields['Venue'] + '_' + recordID.slice(3, 7)),
        })
      }).then(r => r.json());

      await airtable.update('Application Tracker', recordID, {
        'Slack Channel': `https://app.slack.com/client/T0266FRGM/${channelData.id}`,
      });
      res.send(200);
      return;
    } else {
      console.log('Slack channel already exists, skipping');
      res.send(200);
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}