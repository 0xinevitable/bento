import { Wallet } from '@bento/common';
import { atomWithStorage } from 'jotai/utils';

import { storage } from './storage';

const key = '@wallets_v3';
// @ts-ignore FIXME:
export const walletsAtom = atomWithStorage<Wallet[]>(key, [], storage);
