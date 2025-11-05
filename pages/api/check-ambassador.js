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
    // Note: Field name in Airtable is "Slack ID" with capital letters and space
    const ambassador = await airtable.find('Ambassadors', `{Slack ID}='${slackId}'`)
    
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
