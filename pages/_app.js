/** @format */

import '../styles/globals.css';
import { Provider } from 'next-auth/client';
import { signIn } from 'next-auth/dist/client';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  try {
    if (window) {
      signIn();
    }
  } catch (err) {
    console.log('some error');
  }

  return (
    <Provider session={session}>
      <Component {...pageProps} />{' '}
    </Provider>
  );
}

export default MyApp;
