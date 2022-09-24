import LocalizedStrings from 'react-localization';

import { UserProfileTab } from '../types/UserProfile';

export const LocalizedTabNames = new LocalizedStrings({
  en: {
    [UserProfileTab.Links]: 'Links',
    [UserProfileTab.Questions]: 'Questions',
  },
  ko: {
    [UserProfileTab.Links]: '프로필 링크',
    [UserProfileTab.Questions]: '질문하기',
  },
});
