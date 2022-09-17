import { Session } from '@supabase/supabase-js';
import { atom } from 'recoil';

const key = '@session';
export const sessionAtom = atom<Session | null>({
  key,
  default: null,
});
