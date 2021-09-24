/** @format */

import NextAuth from 'next-auth';
import { signOut } from 'next-auth/dist/client';
import { Slack } from 'next-auth/providers';

export default NextAuth({
  providers: [
    Slack({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ email }) {
      const emails = process.env.EMAILS;
      const valid_emails = emails ? emails.split(',') : [];

      console.log('valid emails = ', valid_emails);
      console.log('got', email);

      if (valid_emails.includes(email)) return true;

      console.log('not allowed');
      return false;
    },
  },
  pages: {
    error: '/error',
  },
});
