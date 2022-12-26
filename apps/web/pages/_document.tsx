import Document, { Head, Html, Main, NextScript } from 'next/document';

import i18nextConfig from '../next-i18next.config';

export default class MyDocument extends Document {
  render() {
    const currentLocale =
      this.props.__NEXT_DATA__.locale || i18nextConfig.i18n.defaultLocale;

    return (
      <Html lang={currentLocale}>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />
        </Head>

        {/* NOTE: preload 클래스 삭제 전에는 CSS 트랜지션 비활성화 */}
        <body className="preload">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
