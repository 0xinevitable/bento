const withTM = require('next-transpile-modules')([
  '@bento/adapters',
  '@bento/common',
  '@bento/core',
]);

module.exports = withTM({
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    externalDir: false,
  },
});
