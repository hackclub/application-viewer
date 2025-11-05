import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import airtable from '../../../utils/airtable'

// Debug: Check if env vars are loaded
console.log('AUTH_SLACK_CLIENT_ID:', process.env.AUTH_SLACK_CLIENT_ID ? 'Set ✓' : 'Missing ✗')
console.log('AUTH_SLACK_CLIENT_SECRET:', process.env.AUTH_SLACK_CLIENT_SECRET ? 'Set ✓' : 'Missing ✗')
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL || 'Not set - using auto-detect')
console.log('NODE_ENV:', process.env.NODE_ENV)

const options = {
  theme: 'light',
  debug: process.env.NODE_ENV === 'development',
  // Configure one or more authentication providers
  providers: [
    Providers.Slack({
      clientId: process.env.AUTH_SLACK_CLIENT_ID,
      clientSecret: process.env.AUTH_SLACK_CLIENT_SECRET
    })
  ],
  callbacks: {
    async signIn(user, account, profile) {
      const slackId = user.id
      console.log(`[AUTH] Sign-in: ${user.name}, Slack ID: ${slackId}`)
      
      // Allow sign-in to complete quickly - we'll check ambassador status on page load
      // This prevents OAuth callback timeout issues
      return true
    },
    async jwt(token, user, account, profile) {
      // Add user info to JWT on first sign in
      if (user) {
        token.slackId = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session(session, token) {
      // Add Slack ID and info to session
      if (token) {
        session.slackId = token.slackId
        session.user = {
          name: token.name,
          email: token.email,
          image: token.picture
        }
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
