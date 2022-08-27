import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import { sessionAtom } from '@/recoil/session';
import { walletsAtom } from '@/recoil/wallets';
import { Supabase } from '@/utils/Supabase';

export const useSignOut = () => {
  const setWallets = useSetRecoilState(walletsAtom);
  const setCurrentSession = useSetRecoilState(sessionAtom);

  const signOut = useCallback(async () => {
    setWallets([]);
    setCurrentSession(null);
    await Supabase.auth.signOut();
  }, [setWallets, setCurrentSession]);

  return { signOut };
};
