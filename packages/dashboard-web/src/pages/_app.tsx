import React from 'react';

import '@/styles/tailwind.css';
import '@/styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <React.Fragment>
      <Component {...pageProps} />
    </React.Fragment>
  );
}

export default MyApp;
