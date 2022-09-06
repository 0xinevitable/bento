import { Wallet } from '@bento/common';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';

import { walletsAtom } from '@/recoil/wallets';
import { Supabase } from '@/utils/Supabase';

import { useSession } from './useSession';

export const WalletManager: React.FC = () => {
  const [wallets] = useRecoilState(walletsAtom);
  const [isWalletEmpty, setWalletEmpty] = useState<boolean>(false);

  const revalidateWallets = useRevalidateWallets();

  useEffect(() => {
    if (wallets.length === 0 && !isWalletEmpty) {
      revalidateWallets().then((wallets) => {
        if (!wallets || wallets.length === 0) {
          setWalletEmpty(true);
        }
      });
    }
  }, [wallets, revalidateWallets]);

  useEffect(() => {
    Supabase.auth.onAuthStateChange((event, _session) => {
      if (event == 'SIGNED_IN') {
        revalidateWallets().then((wallets) => {
          if (!wallets || wallets.length === 0) {
            setWalletEmpty(true);
          }
        });
      }
    });
  }, [revalidateWallets]);

  return null;
};

export const useRevalidateWallets = () => {
  const { session } = useSession();
  const setWallets = useSetRecoilState(walletsAtom);

  const revalidateWallets = useCallback(async () => {
    if (!session || !session.user) {
      return;
    }
    const walletQuery = await Supabase.from('wallets')
      .select('*')
      .eq('user_id', session.user.id);
    const wallets: Wallet[] = walletQuery.data ?? [];

    if (wallets.length > 0) {
      setWallets(wallets);
    }

    return wallets;
  }, [JSON.stringify(session), setWallets]);

  return revalidateWallets;
};
