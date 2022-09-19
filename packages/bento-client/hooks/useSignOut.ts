import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { sessionAtom, walletsAtom } from '../states';
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
