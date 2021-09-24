/** @format */

import '../styles/globals.css';
import { Provider } from 'next-auth/client';
import { ThemeProvider } from '@theme-ui/theme-provider';
import theme from '../js/theme/index';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <Provider session={session}>
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
