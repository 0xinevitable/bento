import { atomWithStorage } from 'jotai/utils';

export interface Session {
  user?: {
    id: string;
    email?: string;
  };
  access_token?: string;
  expires_in?: number;
}

export const sessionAtom = atomWithStorage<Session | null>('@session', null);