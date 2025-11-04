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
      clientSecret: process.env.AUTH_SLACK_CLIENT_SECRET,
      scope: 'identity.basic identity.email identity.avatar'
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      try {
        // Get the Slack user ID
        const slackId = user.id
        
        // Check if this Slack ID exists in the Ambassadors table
        const ambassadors = await airtable.get('Ambassadors')
        const isAmbassador = ambassadors.some(ambassador => 
          ambassador.fields.slack_id === slackId
        )
        
        console.log(`Sign-in attempt by Slack ID: ${slackId}, Is Ambassador: ${isAmbassador}`)
        
        return isAmbassador
      } catch (error) {
        console.error('Error checking ambassador status:', error)
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

  // Database is optional for OAuth providers
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
}

export default NextAuth(options)
