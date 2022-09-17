import { sessionAtom } from '@bento/client/recoil/session';
import { walletsAtom } from '@bento/client/recoil/wallets';
import { useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { Supabase } from '@/utils/Supabase';

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
