/** @format */

import NextAuth from 'next-auth';
import { Slack } from 'next-auth/providers';

export default NextAuth({
  providers: [
    Slack({
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
    }),
  ],
});
