import React, { useEffect } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { RecoilRoot } from 'recoil';

import 'react-notifications-component/dist/theme.css';
import '@/styles/tailwind.css';
import '@/styles/global.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import styled from 'styled-components';

import { NavigationBar } from '@/components/NavigationBar';
import { SessionManager } from '@/hooks/useSession';
import { RevalidateWalletsProvider } from '@/hooks/useWallets';
import { Analytics } from '@/utils/analytics';

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
      <RecoilRoot>
        <ReactNotifications />
        <SessionManager />
        <RevalidateWalletsProvider>
          <Container>
            <NavigationBar />

            <Component {...pageProps} />
          </Container>

          <div id="portal" />
          <div id="landing-background" />
        </RevalidateWalletsProvider>
      </RecoilRoot>
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
