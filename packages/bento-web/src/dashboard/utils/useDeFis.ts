import { Wallet } from '@bento/common';
import { useMemo } from 'react';

import { getDeFiStakingValue } from '@/defi/klaytn/utils/getDeFiStakingValue';
import { DeFiStaking, DeFiStakingResponse } from '@/defi/types/staking';
import { FeatureFlags } from '@/utils';

import { useMultipleRequests } from './useMultipleRequests';

type DeFiStakingWithClientData = DeFiStaking & {
  walletAddress: string;
  valuation: number;
};

export const useDeFis = (wallets: Wallet[]) => {
  const calculatedRequests = useMemo(
    () =>
      !FeatureFlags.isKlaytnDeFiEnabled
        ? []
        : wallets.flatMap((wallet) =>
            wallet.type === 'evm' && wallet.networks.includes('klaytn')
              ? `/api/defis/klaytn/${wallet.address}`
              : [],
          ),
    [JSON.stringify(wallets)],
  );

  // FIXME: Refetch rule
  const { responses: result, refetch } =
    useMultipleRequests<DeFiStakingResponse>(calculatedRequests);
  const defis = useMemo<DeFiStakingWithClientData[]>(
    () =>
      result.flatMap((item) => {
        if (!item.data?.stakings) {
          return [];
        }
        return item.data.stakings.map((staking) => ({
          ...staking,
          walletAddress: item.data?.walletAddress!,
          valuation: getDeFiStakingValue(staking),
        }));
      }),
    [JSON.stringify(result)],
  );
  return { defis, defisJSONKey: JSON.stringify(defis) };
};
