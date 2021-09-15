export default async ({ channel, text }) => {
  console.log(`Posting in CHANNEL '${channel}' TEXT '${text}'`)
  return await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BOUNCER_SLACK_TOKEN}`
    },
    body: JSON.stringify({
      channel,
      text
    })
  }).then(r => r.json()).catch(err => {
    console.error(err)
  });
}