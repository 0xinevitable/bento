import { Wallet } from '@bento/common';
import { useMemo } from 'react';

import { DeFiStaking, DeFiStakingResponse } from '@/defi/types/staking';

import { useMultipleRequests } from './useMultipleRequests';

type DeFiStakingForWalletAddress = DeFiStaking & {
  walletAddress: string;
};

export const useDeFis = (wallets: Wallet[]) => {
  const calculatedRequests = useMemo(
    () =>
      wallets.flatMap((wallet) =>
        wallet.type === 'evm' && wallet.networks.includes('klaytn')
          ? `/api/defis/klaytn/${wallet.address}`
          : [],
      ),
    [JSON.stringify(wallets)],
  );

  // FIXME: Refetch rule
  const { responses: result, refetch } =
    useMultipleRequests<DeFiStakingResponse>(calculatedRequests);
  const defis = useMemo<DeFiStakingForWalletAddress[]>(
    () =>
      result.flatMap(
        (r) =>
          r.data?.stakings?.map((v) => ({
            ...v,
            walletAddress: r.data?.walletAddress!,
          })) || [],
      ),
    [JSON.stringify(result)],
  );
  return { defis, defisJSONKey: JSON.stringify(defis) };
};
