import { Wallet } from '@bento/common';
import React, { useCallback, useContext, useState } from 'react';

// import { Supabase } from '../utils';
// import { useSession } from './useSession';

const WalletsContext = React.createContext<{
  wallets: Wallet[];
  setWallets: React.Dispatch<React.SetStateAction<Wallet[]>>;
  revalidateWallets: () => Promise<Wallet[] | undefined>;
}>({
  wallets: [],
  setWallets: () => {},
  revalidateWallets: async () => undefined,
});

export const WalletsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // const { session } = useSession();
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const revalidateWallets = useCallback(async () => undefined, []);

  // const revalidateWallets = useCallback(async () => {
  //   if (!session || !session.user) {
  //     return;
  //   }
  //   const walletQuery = await Supabase.from('wallets')
  //     .select('*')
  //     .eq('user_id', session.user.id);
  //   const wallets: Wallet[] = walletQuery.data ?? [];

  //   setWallets(wallets);
  //   return wallets;
  // }, [JSON.stringify(session), setWallets]);

  // const [isWalletEmpty, setWalletEmpty] = useState<boolean>(false);

  // useEffect(() => {
  //   if (wallets.length === 0 && !isWalletEmpty) {
  //     revalidateWallets().then((wallets) => {
  //       if (!wallets || wallets.length === 0) {
  //         setWalletEmpty(true);
  //       }
  //     });
  //   }
  // }, [wallets, revalidateWallets]);

  // useEffect(() => {
  //   const session = Supabase.auth.session();
  //   if (!!session) {
  //     revalidateWallets().then((wallets) => {
  //       if (!wallets || wallets.length === 0) {
  //         setWalletEmpty(true);
  //       }
  //     });
  //   }

  //   Supabase.auth.onAuthStateChange((event, _session) => {
  //     if (event == 'SIGNED_IN') {
  //       revalidateWallets().then((wallets) => {
  //         if (!wallets || wallets.length === 0) {
  //           setWalletEmpty(true);
  //         }
  //       });
  //     }
  //   });
  // }, [revalidateWallets]);

  return (
    <WalletsContext.Provider value={{ wallets, setWallets, revalidateWallets }}>
      {children}
    </WalletsContext.Provider>
  );
};

export const useWalletContext = () => useContext(WalletsContext);
