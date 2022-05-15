const withSvgr = require('next-plugin-svgr');

module.exports = withSvgr({
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      electron: false,
    };
    return config;
  },
});
