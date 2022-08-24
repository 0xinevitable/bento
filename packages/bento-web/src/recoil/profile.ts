import { atom } from 'recoil';

import { UserProfile } from '@/profile/types/UserProfile';

import { localStorageEffect } from './effects/localStorageEffect';

const key = '@profile_v1';
export const profileAtom = atom<UserProfile | null>({
  key,
  default: null,
  effects_UNSTABLE: [localStorageEffect(key)],
});
