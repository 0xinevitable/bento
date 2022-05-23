import React from 'react';
import { RecoilRoot } from 'recoil';

import '@/styles/tailwind.css';
import '@/styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
    </RecoilRoot>
  );
}

export default MyApp;
