/** @format */

import { Button } from '@theme-ui/components';
import { getSession, signIn, signOut } from 'next-auth/client';
import Auth from '../js/components/Auth';

const Test = ({ ses }) => {
  console.log('it is', ses);

  if (!ses) {
    return <Auth />;
  }

  return (
    <div>
      signed in
      <Button onClick={signOut()}> LogOut </Button>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      ses: JSON.stringify(session),
    },
  };
}

export default Test;
