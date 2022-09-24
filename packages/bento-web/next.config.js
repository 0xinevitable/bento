const withSvgr = require('next-plugin-svgr');
const withInterceptStdout = require('next-intercept-stdout');
const { withPlugins } = require('next-composed-plugins');

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
    swcMinify: true,
    compiler: {
      styledComponents: true,
    },
    experimental: {
      externalDir: true,
    },
    publicRuntimeConfig: pick(process.env, ['ENVIRONMENT']),
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
          destination: '/profile/intro',
          permanent: false,
        },
      ];
    },
  },
  [
    withSvgr,
    [
      withInterceptStdout,
      (text) => (text.includes('Duplicate atom key') ? '' : text),
    ],
    withBundleAnalyzer,
  ],
);
