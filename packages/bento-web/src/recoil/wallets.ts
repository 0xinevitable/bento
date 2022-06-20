import { Wallet } from '@bento/common';
import { atom } from 'recoil';

const key = '@wallets_v3';
export const walletsAtom = atom<Wallet[]>({
  key,
  default: [],
});
