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
    compiler: {
      styledComponents: true,
    },
    publicRuntimeConfig: pick(process.env, [
      'ENVIRONMENT',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY',
    ]),
    webpack: (config) => {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        electron: false,
      };
      return config;
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
