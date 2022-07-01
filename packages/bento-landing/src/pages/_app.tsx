import Head from 'next/head';
import React, { useEffect } from 'react';

import { GlobalStyle } from '@/components/GlobalStyle';
import { Analytics } from '@/utils/analytics';

Analytics.initialize();

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.querySelector('body').classList.remove('preload');
  }, []);

  return (
    <React.Fragment>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <GlobalStyle />
      <Component {...pageProps} />
      <div id="portal" />
    </React.Fragment>
  );
}

export default MyApp;
