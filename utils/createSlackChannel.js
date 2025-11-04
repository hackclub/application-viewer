import airtable from "./airtable";
import ensureMethod from "./ensureMethod";

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

export default async (recordID) => {
  // given a club recordID, create a slack channel & save it
  if (!recordID) throw new Error('No recordID in body')

  const clubRecord = await airtable.find('Clubs', recordID);

  if (!clubRecord) throw new Error('No club found with that recordID')

  if (!clubRecord.fields['Slack Channel ID'] || clubRecord.fields['Slack Channel ID'].length == 0) {
    const responseData = await createUniqueChannel(clubRecord.fields['venue_name'])

    return responseData.channel.id;
  } else {
    console.log('Slack channel already exists, not creating a new one');
    return clubRecord.fields['Slack Channel ID'];
  }

}