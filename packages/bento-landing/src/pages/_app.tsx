import React, { useEffect } from 'react';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    document.querySelector('body').classList.remove('preload');
  }, []);

  return (
    <React.Fragment>
      <Component {...pageProps} />
      <div id="portal" />
    </React.Fragment>
  );
}

export default MyApp;
