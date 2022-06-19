import React, { useEffect } from 'react';
import { ReactNotifications } from 'react-notifications-component';
import { RecoilRoot } from 'recoil';

import 'react-notifications-component/dist/theme.css';
import '@/styles/tailwind.css';
import '@/styles/global.css';

import { AppProps } from 'next/app';

import { SessionManager } from '@/hooks/useSession';

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
      <Component {...pageProps} />
      <div id="portal" />
    </RecoilRoot>
  );
}

export default MyApp;
