import { atomWithStorage } from 'jotai/utils';

import { storage } from '@/states';

import { UserProfile } from '../types/UserProfile';

const key = '@profile_v1';
export const profileAtom = atomWithStorage<UserProfile | null>(
  key,
  null,
  // @ts-ignore FIXME:
  storage,
);
