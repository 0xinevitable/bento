import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { sessionAtom } from '../recoil/session';
import { walletsAtom } from '../recoil/wallets';
import { Supabase } from '../utils/Supabase';

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
