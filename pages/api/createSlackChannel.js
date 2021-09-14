import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";

const safeChannelName = (name) => {
  return name.replace(/[^a-z0-9]/gi, "_").slice(0, 80).toLowerCase();
}

const createUniqueChannel = async (name, retrying=false) => {
  let attemptName = name;

  if (retrying) {
    attemptName = attemptName.slice(0, 74) + '_' + Math.random().toString(16).slice(2,6);
    console.log(`...failed, retrying with the name: '${attemptName}'`);
  } else {
    console.log(`Trying to create a Slack channel with the name: '${attemptName}'...`);
  }

  // (msw) I tried using postData() helper for this, but was getting strange errors from Slack, so switching back to fetch
  const channelData = await fetch('https://slack.com/api/conversations.create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BOUNCER_SLACK_TOKEN}`
    },
    body: JSON.stringify({
      name: safeChannelName(attemptName),
    })
  }).then(r => r.json());

  if (channelData.ok) {
    return channelData
  } else if (!channelData.ok && channelData.error === 'name_taken') {
    return await createUniqueChannel(name, true)
  } else {
    return channelData
  }
}

export default async (req, res) => {
  // given an application recordID, create a slack channel & save it
  try {
    ensureMethod({req, method: 'POST'});

    const { recordID } = req.body;

    if (!recordID) {
      const err = new Error('No recordID in body')
      err.status = 404
      throw err
    }

    const application = await airtable.find('Application Tracker', recordID);

    if (!application) {
      const err = new Error('No application found with that recordID')
      err.status = 404
      throw err
    }

    if (!application.fields['Slack Channel ID'] || application.fields['Slack Channel ID'].length == 0) {
      const responseData = await createUniqueChannel(application.fields['Venue'])

      await airtable.patch('Application Tracker', recordID, {
        'Slack Channel ID': responseData.channel.id,
      });
      res.send({
        channelURL: `https://app.slack.com/client/T0266FRGM/${responseData.channel.id}`
      });
      return;
    } else {
      console.log('Slack channel already exists, not creating a new one');
      res.send({
        channelURL: application.fields['Slack Channel']
      });
      return;
    }
  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}