import { Wallet } from '@bento/common';
import { useEffect, useMemo, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';

import {
  Valuation,
  getDeFiStakingValue,
} from '@/defi/klaytn/utils/getDeFiStakingValue';
import { DeFiStaking, DeFiStakingResponse } from '@/defi/types/staking';

import { useMultipleRequests } from './useMultipleRequests';

export type DeFiStakingWithClientData = DeFiStaking & {
  walletAddress: string;
  valuation: Valuation;
};

export const useDeFis = (wallets: Wallet[]) => {
  const calculatedRequests = useMemo(
    () =>
      wallets.reduce<string[]>((acc, wallet) => {
        // FIXME: Add more DeFis here
        if (
          wallet.type === 'cosmos-sdk' &&
          wallet.networks.includes('osmosis')
        ) {
          return [...acc, `/api/defis/osmosis/${wallet.address}`];
        }
        if (wallet.type === 'evm' && wallet.networks.includes('klaytn')) {
          return [...acc, `/api/defis/klaytn/${wallet.address}`];
        }
        return acc;
      }, []),
    [JSON.stringify(wallets)],
  );

  // FIXME: Refetch rule
  const { responses: result, refetch } =
    useMultipleRequests<DeFiStakingResponse>(calculatedRequests);
  const { getCachedPrice } = useCachedPricings();

  const [defis, setDefis] = useState<DeFiStakingWithClientData[]>([]);

  useEffect(() => {
    const items = result.flatMap((item) => {
      if (!item.data?.stakings) {
        return [];
      }
      return item.data.stakings.map((staking) => ({
        ...staking,
        walletAddress: item.data?.walletAddress!,
        valuation: getDeFiStakingValue(staking, getCachedPrice),
      }));
    });

    setDefis(items);
  }, [result, getCachedPrice]);

  return { defis };
};
