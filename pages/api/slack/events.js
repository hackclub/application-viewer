import airtable from "../../../utils/airtable";
import ensureMethod from "../../../utils/ensureMethod";
import slackPostMessage from "../../../utils/slackPostMessage";
import transcript from "../../../utils/transcript";

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
        const bouncerChannels = ['C0P5NE354' /* #bot-spam */]
        if (process.env.NODE_ENV == 'production') {
          bouncerChannels.push('CM08L302G' /* #bouncer-checkin */)
        }

        const { event } = req.body

        const mentionSubstring = '<@ULG7GRP0A>' // @bouncer
        if (bouncer_channels.includes(event.channel) && event.type == 'message' && event.text.startsWith(mentionSubstring)) {
          console.log('...responding!')
          const { user, text, channel, ts } = event
          await slackReact({ channel, timestamp: ts, name: 'beachball' })
          const cleanedText = text.replace(mentionSubstring, '').trim()
          const club = await airtable.find('Application Tracker', `{Check-In Pass}='${cleanedText}'`)
          if (club) {
            await Promise.all([
              slackReact({ channel, timestamp: ts, name: 'white_check_mark' }),
              slackPostMessage({ channel, text: transcript('bouncer-checkin.found', {pass: cleanedText, channel: club.fields['Slack Channel ID'], user}) })
            ])
          } else {
            await Promise.all([
              slackReact({ channel, timestamp: ts, name: 'thonk' }),
              slackPostMessage({ channel, text: transcript('bouncer-checkin.not-found', {pass: cleanedText, user}) })
            ])
          }
          await slackReact({ channel, timestamp: ts, name: 'beachball', addOrRemove: 'remove' })
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
    console.error(err)
  }

  // (msw) Slack will temporarily turn off our app if they see other status
  // codes, so we'll send them a 200 even if we error.

  // (msw) Keep in mind that vercel doesn't support fire-and-forget serverless
  // functions... once this line runs our code will stop running (even stuff
  // happening async)
  res.status(200).send()
}