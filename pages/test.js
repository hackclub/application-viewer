/** @format */

import { getSession } from 'next-auth/client';
import { signIn } from 'next-auth/dist/client';

const Test = ({ ses }) => {
  console.log('session is', ses);
  try {
    if (!ses && window) {
      signIn('slack', { callbackUrl: 'https://9073-59-91-109-162.io/sign' });
    }
  } catch (err) {}

  return <div>yay</div>;
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return { props: { ses: session } };
};

export default Test;
