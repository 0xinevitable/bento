import { UserProfile } from '@bento/private/profile/types/UserProfile';
import { atom } from 'recoil';

import { localStorageEffect } from './effects/localStorageEffect';

const key = '@profile_v1';
export const profileAtom = atom<UserProfile | null>({
  key,
  default: null,
  effects_UNSTABLE: [localStorageEffect(key)],
});
