import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import { sessionAtom } from '@/recoil/session';
import { walletsAtom } from '@/recoil/wallets';
import { Supabase } from '@/utils/Supabase';

export const useSignOut = () => {
  const setWallets = useSetRecoilState(walletsAtom);
  const setCurrentSession = useSetRecoilState(sessionAtom);

  const signOut = useCallback(() => {
    setWallets([]);
    setCurrentSession(null);
    Supabase.auth.signOut();
  }, [setWallets, setCurrentSession]);

  return { signOut };
};
