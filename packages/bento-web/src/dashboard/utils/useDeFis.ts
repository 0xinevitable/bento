import { Wallet } from '@bento/common';
import { useMemo } from 'react';

import { DeFiStakingResponse } from '@/defi/types/staking';

import { useMultipleRequests } from './useMultipleRequests';

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
  const defis = useMemo(
    () => result.flatMap((r) => r.data?.stakings || []),
    [JSON.stringify(result)],
  );
  return { defis, defisJSONKey: JSON.stringify(defis) };
};
