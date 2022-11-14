import { LocalizedString } from '@/constants/adapters';

export const formatUsername = (
  username: string | undefined,
  prefix: string = '@',
) => {
  if (!username) {
    return prefix + 'unknown';
  }
  if (username.length >= 36) {
    return prefix + username.slice(0, 13) + '...';
  }
  return prefix + username;
};

export const formatLocalizedString = (
  value: LocalizedString,
  currentLanguage: string,
) => (typeof value === 'string' ? value : value[currentLanguage] || value.en);
