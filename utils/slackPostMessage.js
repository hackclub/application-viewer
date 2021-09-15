export default async ({ channel, text, timestamp }) => {
  console.log(`${timestamp ? 'Replying' : 'Posting'} in CHANNEL '${channel}' TEXT '${text}'`)

  const body = { channel, text }

  if (timestamp) {
    body.thread_ts = timestamp
  }

  const result = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BOUNCER_SLACK_TOKEN}`
    },
    body: JSON.stringify(body)
  }).then(r => r.json()).catch(err => {
    console.error(err)
  });
  console.log({result})
  return result
}