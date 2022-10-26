const withTM = require('next-transpile-modules')([
  '@bento/common',
  '@bento/core',
]);

module.exports = withTM({
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    externalDir: false,
  },
});
