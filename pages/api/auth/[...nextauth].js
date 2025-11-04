import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import airtable from '../../../utils/airtable'

// Debug: Check if env vars are loaded
console.log('AUTH_SLACK_CLIENT_ID:', process.env.AUTH_SLACK_CLIENT_ID ? 'Set ✓' : 'Missing ✗')
console.log('AUTH_SLACK_CLIENT_SECRET:', process.env.AUTH_SLACK_CLIENT_SECRET ? 'Set ✓' : 'Missing ✗')

const options = {
  theme: 'light',
  // Configure one or more authentication providers
  providers: [
    Providers.Slack({
      clientId: process.env.AUTH_SLACK_CLIENT_ID,
      clientSecret: process.env.AUTH_SLACK_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      try {
        // Get the Slack user ID
        const slackId = user.id
        console.log(`Sign-in attempt by Slack ID: ${slackId}`)
        
        // Check if this Slack ID exists in the Ambassadors table
        // Use filterByFormula to query directly instead of fetching all records
        const ambassador = await airtable.find('Ambassadors', `{slack_id}='${slackId}'`)
        
        const isAmbassador = !!ambassador
        console.log(`Is Ambassador: ${isAmbassador}`)
        
        return isAmbassador
      } catch (error) {
        console.error('Error checking ambassador status:', error)
        // In case of error, deny access for security
        return false
      }
    },
    async session(session, token) {
      // Add Slack ID to session
      if (token.sub) {
        session.slackId = token.sub
      }
      return session
    }
  },

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  // Use JWT instead of database sessions to avoid database timeouts
  session: {
    jwt: true,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Database is optional - comment out if not needed to avoid connection timeouts
  ...(process.env.DB_HOST && {
    database: {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    }
  })
}

export default NextAuth(options)
