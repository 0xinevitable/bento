import React from 'react';
import { RecoilRoot } from 'recoil';
import { ReactNotifications } from 'react-notifications-component';

import 'react-notifications-component/dist/theme.css';
import '@/styles/tailwind.css';
import '@/styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ReactNotifications />
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
