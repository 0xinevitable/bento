import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import ko from 'javascript-time-ago/locale/ko';

declare global {
  interface Navigator {
    userLanguage?: string;
    browserLanguage?: string;
  }
}

const getInterfaceLanguage = () => {
  const defaultLang = 'en';
  if (typeof navigator === 'undefined') {
    return defaultLang;
  }
  const nav = navigator;
  if (nav) {
    if (nav.language) {
      return nav.language;
    }
    if (!!nav.languages && !!nav.languages[0]) {
      return nav.languages[0];
    }
    if (nav.userLanguage) {
      return nav.userLanguage;
    }
    if (nav.browserLanguage) {
      return nav.browserLanguage;
    }
  }
  return defaultLang;
};

TimeAgo.addLocale(en);
TimeAgo.addLocale(ko);

export const useTimeAgo = () => {
  const language = getInterfaceLanguage();
  const timeAgo = new TimeAgo(language === 'ko' ? 'ko' : 'en');
  return timeAgo;
};
