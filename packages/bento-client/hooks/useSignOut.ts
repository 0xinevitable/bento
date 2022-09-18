import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { sessionAtom } from '../jotai/session';
import { walletsAtom } from '../jotai/wallets';
import { Supabase } from '../utils';

export const useSignOut = () => {
  const setWallets = useSetAtom(walletsAtom);
  const setCurrentSession = useSetAtom(sessionAtom);

  const signOut = useCallback(async () => {
    setWallets([]);
    setCurrentSession(null);
    await Supabase.auth.signOut();
  }, [setWallets, setCurrentSession]);

  return { signOut };
};
