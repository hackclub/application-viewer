import { getSession } from 'next-auth/client'
import airtable from '../../utils/airtable'

export default async function handler(req, res) {
  try {
    const session = await getSession({ req })
    
    if (!session || !session.slackId) {
      return res.status(401).json({ isAmbassador: false, error: 'Not authenticated' })
    }
    
    const slackId = session.slackId
    console.log(`[CHECK] Checking ambassador status for Slack ID: ${slackId}`)
    
    // Check if this Slack ID exists in the Ambassadors table
    const ambassador = await airtable.find('Ambassadors', `{slack_id}='${slackId}'`)
    
    const isAmbassador = !!ambassador
    console.log(`[CHECK] Is Ambassador: ${isAmbassador}`)
    
    res.status(200).json({ 
      isAmbassador,
      slackId: isAmbassador ? slackId : null,
      name: session.user?.name
    })
  } catch (error) {
    console.error('[CHECK] Error checking ambassador status:', error)
    res.status(500).json({ isAmbassador: false, error: 'Check failed' })
  }
}
