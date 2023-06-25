const withTM = require('next-transpile-modules')([
  '@bento/common',
  '@bento/core',
]);

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
      'SERVERLESS_API_BASE_URL',
    ]),
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        electron: false,
      };
      config.module = {
        ...config.module,
        exprContextCritical: false,
      };
      return config;
    },
    async redirects() {
      // redirect everything except /api, /wip, / to /wip
      const keywords = ['u', 'wallet', 'home'];
      return keywords.flatMap((v) => [
        {
          source: `/${v}`,
          destination: `/wip`,
          permanent: false,
        },
        {
          source: `/${v}/:path*`,
          destination: `/wip`,
          permanent: false,
        },
      ]);
    },
  },
  [
    withTM,
    [
      withInterceptStdout,
      (text) => (text.includes('Duplicate atom key') ? '' : text),
    ],
    withBundleAnalyzer,
  ],
);
