import airtable from "../../../utils/airtable";
import ensureMethod from "../../../utils/ensureMethod";

const slackPostMessage = async ({ channel, text }) => {
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

export default async (req, res) => {
  ensureMethod({ req, method: 'POST' })

  try {


    console.log(`Got a '${req.body.type}' event from Slack...`)

    switch (req.body.type) {
      case 'url_verification':
        res.send({ challenge: req.body.challenge })
        console.log('...replying!')
        return;
        break;
      case 'event_callback':
        const bouncer_channels = [
          // 'CM08L302G', // #bouncer-checkin
          'C0P5NE354', // #bot-spam
        ]

        const { event } = req.body

        const mentionSubstring = '<@ULG7GRP0A>' // @bouncer
        if (bouncer_channels.includes(event.channel) && event.type == 'message' && event.text.startsWith(mentionSubstring)) {
          console.log('...responding!')
          const { user, text, ts, channel } = event
          const cleanedText = text.replace(mentionSubstring, '').trim()
          const club = await airtable.find('Application Tracker', `{Check-In Pass}='${cleanedText}'`)
          if (club) {
            // console.log(`Adding LEADER '${user}' to CLUB'${club.id}'`)
            // console.log('Old value is:', club.fields['Leader Slack IDs'])
            // const leaders = club.fields['Leader Slack IDs'] || ''
            // const leaderIDsSet = new Set(leaders.split(','))
            // leaderIDsSet.add(user)
            // await airtable.patch(Array.from(leaderIDsSet).join(','))
            // console.log('New value is:', Array.from(leaderIDsSet).join(','))

            await slackPostMessage({ channel, text: `<@${user}>, run along and join your team in <#${club.fields['Slack Channel ID']}>.` })
          } else {
            // pity the foo'
            await slackPostMessage({ channel, text: `what kinda crazy mumbo-jumbo nonsense is this?? I could find a solid _nobody_ in our applications database with the registration passphrase "${cleanedText}". try again, fool.` })
          }
        } else {
          console.log('...ignoring!')
          // just ignore the message if it wasn't in a channel bouncer listens to
        }
        break;
      default:
        console.log(`...I don't know how to handle '${req.body.type}' events, so I'll just reply with 200.`)
        break;
    }
  } catch (err) {

  }

  // (msw) Slack will temporarily turn off our app if they see other status
  // codes, so we'll send them a 200 even if we error.

  // (msw) Keep in mind that vercel doesn't support fire-and-forget serverless
  // functions... once this line runs our code will stop running (even stuff
  // happening async)
  res.status(200).send()
}