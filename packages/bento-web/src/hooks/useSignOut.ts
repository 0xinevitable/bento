import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { sessionAtom } from '../states';
import { Supabase } from '../utils';
import { useWalletContext } from './useWalletContext';

export const useSignOut = () => {
  // const { setWallets } = useWalletContext();
  const setCurrentSession = useSetAtom(sessionAtom);

  const signOut = useCallback(async () => {
    // setWallets([]);
    setCurrentSession(null);
    await Supabase.auth.signOut();
  }, [
    // setWallets,
    setCurrentSession,
  ]);

  return { signOut };
};
