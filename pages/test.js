/** @format */

import { Button } from '@theme-ui/components';
import { ThemeProvider } from '@theme-ui/theme-provider';
import { getSession, signOut } from 'next-auth/client';
import { signIn } from 'next-auth/dist/client';
import Auth from '../js/components/Auth';

import theme from '../js/theme/index';

const Test = ({ ses }) => {
  console.log('session is', ses);

  try {
  } catch (err) {}

  if (!ses)
    return (
      <ThemeProvider theme={theme}>
        <Auth />
      </ThemeProvider>
    );

  return (
    <div>
      yay <Button onClick={signOut}>Sign Out</Button>{' '}
    </div>
  );
};

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  return { props: { ses: session } };
};

export default Test;
