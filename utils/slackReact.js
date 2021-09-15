export default async ({ channel, timestamp, name, addOrRemove='add' }) => {
  console.log(`attempting to react with REACTION :${name}: in CHANNEL '${channel}'`)
  return await fetch(`https://slack.com/api/reactions.${addOrRemove}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.BOUNCER_SLACK_TOKEN}`,
    },
    body: JSON.stringify({ channel, name, timestamp })
  }).then(r => r.json()).catch(err => {
    console.error(err)
  })
}