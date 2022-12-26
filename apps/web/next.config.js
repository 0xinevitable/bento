const withTM = require('next-transpile-modules')([
  '@bento/common',
  '@bento/core',
]);

const withSvgr = require('next-plugin-svgr');
const withInterceptStdout = require('next-intercept-stdout');
const { withPlugins } = require('next-composed-plugins');
const { i18n } = require('./next-i18next.config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const pick = (obj, keys) =>
  keys.reduce(
    (result, key) => ({
      ...result,
      [key]: obj[key],
    }),
    {},
  );

module.exports = withPlugins(
  {
    reactStrictMode: true,
    compiler: {
      emotion: true,
    },
    experimental: {
      // NOTE: Disabled because of transpilation performance issues
      externalDir: false,
    },
    i18n,
    publicRuntimeConfig: pick(process.env, [
      'ENVIRONMENT',
      'MAIN_API_BASE_URL',
    ]),
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        electron: false,
      };
      return config;
    },
    async redirects() {
      return [
        {
          source: '/profile/landing',
          destination: '/',
          permanent: false,
        },
        {
          source: '/profile/intro',
          destination: '/',
          permanent: false,
        },
        {
          source: '/community',
          destination: '/',
          permanent: false,
        },
      ];
    },
  },
  [
    withTM,
    withSvgr,
    [
      withInterceptStdout,
      (text) => (text.includes('Duplicate atom key') ? '' : text),
    ],
    withBundleAnalyzer,
  ],
);
