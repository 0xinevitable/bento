import { Wallet } from '@bento/types';
import { atom } from 'recoil';

import { localStorageEffect } from './effects/localStorageEffect';

const key = '@wallets';
export const walletsAtom = atom<Wallet[]>({
  key,
  default: [],
  effects_UNSTABLE: [localStorageEffect(key)],
});
