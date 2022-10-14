const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
  },
  ...(typeof window === undefined
    ? { localePath: path.resolve('./public/locales') }
    : {}),
};
