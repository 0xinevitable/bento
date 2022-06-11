const withSvgr = require('next-plugin-svgr');
const withInterceptStdout = require('next-intercept-stdout');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withInterceptStdout(
    withSvgr({
      reactStrictMode: true,
      compiler: {
        styledComponents: true,
      },
      webpack: (config) => {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          electron: false,
        };
        return config;
      },
    }),
    (text) => (text.includes('Duplicate atom key') ? '' : text),
  ),
);
