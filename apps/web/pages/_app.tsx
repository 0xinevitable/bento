import { GeistProvider } from '@geist-ui/core';
import { appWithTranslation } from 'next-i18next';
import React, { useEffect, useState } from 'react';

import { SessionManager } from '@/hooks/useSession';
import { WalletsProvider } from '@/hooks/useWalletContext';

import { Analytics, ToastProvider } from '@/utils';

import 'react-notifications-component/dist/theme.css';
import '@/styles/fonts.css';
import '@/styles/tailwind.reset.css';

import styled from '@emotion/styled';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { LoadingProgress } from '@/components/LoadingProgress';
import { NavigationBar } from '@/components/NavigationBar';
import { PricingsProvider } from '@/hooks/pricings';
import { GlobalStyle } from '@/styles/GlobalStyle';

import nextI18nextConfig from '../next-i18next.config';

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
    <GeistProvider themeType="dark">
      <GlobalStyle />
      <ToastProvider />

      <SessionManager />
      <PricingsProvider>
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
      </PricingsProvider>
    </GeistProvider>
  );
};

export default appWithTranslation(App, nextI18nextConfig);

const Container = styled.div`
  /* width: 100vw;
  position: relative;
  display: flex;
  flex-direction: column; */
`;
