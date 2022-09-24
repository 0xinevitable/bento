import React, { useEffect } from 'react';

import { SessionManager } from '@/hooks/useSession';
import { WalletsProvider } from '@/hooks/useWalletContext';

import { Analytics, ToastProvider } from '@/utils';

import 'react-notifications-component/dist/theme.css';
import '@/styles/tailwind.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import styled from 'styled-components';

import { NavigationBar } from '@/components/NavigationBar';
import { GlobalStyle } from '@/styles/GlobalStyle';

Analytics.initialize();

type MyAppProps = AppProps & {
  // FIXME: Type mismatch here
  Component: any;
};

function MyApp({ Component, pageProps }: MyAppProps) {
  useEffect(() => {
    document.querySelector('body')?.classList.remove('preload');
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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&family=Raleway:wght@400;700;800;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <GlobalStyle />
      <ToastProvider />

      <SessionManager />
      <WalletsProvider>
        <Container>
          <NavigationBar />

          <Component {...pageProps} />
        </Container>

        <div id="portal" />
        <div id="mobile-menu" />
        <div id="landing-background" />
      </WalletsProvider>
    </React.Fragment>
  );
}

export default MyApp;

const Container = styled.div`
  width: 100vw;

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;
