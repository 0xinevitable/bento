import { Session } from '@supabase/supabase-js';
import { atomWithStorage } from 'jotai/utils';

export const sessionAtom = atomWithStorage<Session | null>('@session', null);
