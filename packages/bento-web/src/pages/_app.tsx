import React, { useEffect } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { RecoilRoot } from 'recoil';

import 'react-notifications-component/dist/theme.css';
import '@/styles/tailwind.css';
import '@/styles/global.css';

import { AppProps } from 'next/app';
import styled from 'styled-components';

import { NavigationBar } from '@/components/NavigationBar';
import { SessionManager } from '@/hooks/useSession';
import { WalletManager } from '@/hooks/useWallets';

type MyAppProps = AppProps & {
  // FIXME: Type mismatch here
  Component: any;
};

function MyApp({ Component, pageProps }: MyAppProps) {
  useEffect(() => {
    document.querySelector('body')?.classList.remove('preload');
  }, []);

  return (
    <RecoilRoot>
      <ReactNotifications />
      <SessionManager />
      <WalletManager />

      <Container>
        <NavigationBar />
        <Black />

        <Component {...pageProps} />
      </Container>

      <div id="portal" />
    </RecoilRoot>
  );
}

export default MyApp;

const Container = styled.div`
  width: 100vw;
  padding-bottom: 100px;

  position: relative;
  overflow: hidden;

  display: flex;
  flex-direction: column;
  background: #0a0a0c;
`;
const Black = styled.div`
  width: 100%;
  height: 64px;
  background-color: rgba(0, 0, 0, 0.5);
`;
