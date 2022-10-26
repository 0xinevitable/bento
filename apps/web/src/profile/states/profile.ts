import { atom } from 'jotai';

import { UserProfile } from '../types/UserProfile';

export const profileAtom = atom<UserProfile | null>(null);
