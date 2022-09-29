import { appWithTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';

import { SessionManager } from '@/hooks/useSession';
import { WalletsProvider } from '@/hooks/useWalletContext';

import { Analytics, ToastProvider } from '@/utils';

import 'react-notifications-component/dist/theme.css';
import '@/styles/tailwind.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { LoadingProgress } from '@/components/LoadingProgress';
import { NavigationBar } from '@/components/NavigationBar';
import { GlobalStyle } from '@/styles/GlobalStyle';

Analytics.initialize();

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  const [loadingState, setLoadingState] = useState({
    isRouteChanging: false,
    loadingKey: 0,
  });

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoadingState((prevState) => ({
        ...prevState,
        isRouteChanging: true,
        loadingKey: prevState.loadingKey ^ 1,
      }));
    };

    const handleRouteChangeEnd = () => {
      setLoadingState((prevState) => ({
        ...prevState,
        isRouteChanging: false,
      }));
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeEnd);
    router.events.on('routeChangeError', handleRouteChangeEnd);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeEnd);
      router.events.off('routeChangeError', handleRouteChangeEnd);
    };
  }, [router.events]);

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
          <LoadingProgress
            isRouteChanging={loadingState.isRouteChanging}
            key={loadingState.loadingKey}
          />
          <NavigationBar />

          <Component {...pageProps} />
        </Container>

        <div id="portal" />
        <div id="profile-edit" />
        <div id="mobile-menu" />
        <div id="landing-background" />
      </WalletsProvider>
    </React.Fragment>
  );
};

export default appWithTranslation(App);

const Container = styled.div`
  width: 100vw;

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
`;
