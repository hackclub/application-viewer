import airtable from "../../utils/airtable";
import ensureMethod from "../../utils/ensureMethod";
import slackReact from "../../utils/slackReact";
import slackPostMessage from "../../utils/slackPostMessage";
import transcript from "../../utils/transcript";
import { checkEmail, sendEmail, sendVerification } from "../../utils/email";

export default async (req, res) => {
  const { recordID, email } = req.body

  try {
    ensureMethod({ req, method: 'POST' })

    const emailVerified = await checkEmail({ address: email.from })
    if (!emailVerified) {
      await sendVerification({ address: email.from })
      res.send({ ok: false, err: 'verify email', email: email.from })
      return
    }

    const clubRecord = await airtable.find('Clubs', recordID)

    const currentEntryNote = clubRecord.fields["notes"];

    const note = currentEntryNote
      ? `${currentEntryNote}\nUpdated with webhook: accept`
      : `Updated with webhook: accept`

    const ambassadorFromPlus = (email) => {
      const [_, plus] = email.split('@')[0].split('+')
      return {
        "hq": "HQ",
        "brasil": "Brasil",
        "apac": "APAC"
      }[plus?.toLowerCase()]
    }

    const ambassadorFromAddress = (email) => {
      return {
        "thomas@hackclub.com": 'HQ'
      }[email?.toLowerCase()]
    }

    const ambassadorName = ambassadorFromPlus(email.from) || ambassadorFromAddress(email.from)

    const promises = []
    let fields = {
      "notes": note,
      "Application Status": "accepted",
      "Club Status": "onboarding"
    }
    
    // Find ambassador record if specified
    if (ambassadorName) {
      try {
        const ambassadorRecord = await airtable.find('Ambassadors', `{name}='${ambassadorName}'`)
        if (ambassadorRecord) {
          fields["rel_ambassador"] = [ambassadorRecord.id]
        }
      } catch (err) {
        console.error(`Error finding ambassador ${ambassadorName}:`, err)
      }
    }
    
    promises.push(airtable.patch('Clubs', recordID, fields))

    promises.push(sendEmail(email));

    const referralCode = clubRecord.fields["referral_code"];
    console.log(`Processing referral code: ${referralCode}`);
    if (referralCode) {
      console.log(`Found referral code: ${referralCode}, incrementing referral count...`);

      try {
        const referralRecord = await airtable.find('Referrals', `{referralCode}='${referralCode}'`);

        if (referralRecord) {
          const currentCount = referralRecord.fields.referralCount || 0;
          const newCount = currentCount + 1;

          promises.push(
            airtable.patch('Referrals', referralRecord.id, {
              "referralCount": newCount,
            })
          );

          console.log(`Incremented referral count from ${currentCount} to ${newCount} for referral code ${referralCode}`);
        } else {
          console.log(`No referral record found for code: ${referralCode}`);
        }
      } catch (referralError) {
        console.error(`Error updating referral count for code ${referralCode}:`, referralError);
      }
    }

    // update slack thread - extract timestamp from notes
    const channel = 'C02F9GD407J' /* #application-conspiracy */
    const tsMatch = currentEntryNote?.match(/Slack TS: (\d+\.\d+)/)
    const timestamp = tsMatch ? tsMatch[1] : null
    if (timestamp) {
      promises.push(slackReact({ channel, timestamp, name: 'white_check_mark' }))
      promises.push(slackReact({ channel, timestamp, name: 'no_entry', addOrRemove: 'remove' }))
    }

    await Promise.all(promises)
    res.send({ ok: true })

  } catch (err) {
    console.error(err);
    res.status(err.status || 500).send(err);
    return;
  }
}