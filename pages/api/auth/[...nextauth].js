import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  theme: 'light',
  // Configure one or more authentication providers
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 30 * 24 * 60 * 60 // 30 days
    })
  ],
  callbacks: {
    async signIn({ email }) {
      return email.endsWith('@hackclub.com')
    }
  },

  // The secret should be set to a reasonably long random string.
  // It is used to sign cookies and to sign and encrypt JSON Web Tokens, unless
  // a separate secret is defined explicitly for encrypting the JWT.
  secret: process.env.SECRET,

  // A database is optional, but required to persist accounts in a database
  // It's also REQUIRED for email sign-in.
  // database: process.env.DATABASE_URL
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
