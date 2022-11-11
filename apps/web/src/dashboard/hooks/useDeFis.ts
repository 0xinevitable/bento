import { Wallet } from '@bento/common';
import { useEffect, useMemo, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';

import {
  BentoDeFiSupportedNetworks,
  BentoSupportedNetwork,
} from '@/constants/networks';
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
      wallets.reduce<string[]>(
        (acc, wallet) => [
          ...acc,
          ...wallet.networks.flatMap((network) =>
            !BentoDeFiSupportedNetworks.includes(
              network as BentoSupportedNetwork,
            )
              ? []
              : `/api/protocols/${network}/${wallet.address}`,
          ),
        ],
        [],
      ),
    [JSON.stringify(wallets)],
  );

  // TODO: Implement refetch rule
  const { responses: result, refetch } =
    useMultipleRequests<DeFiStakingResponse>(calculatedRequests);
  const { getCachedPrice } = useCachedPricings();

  const [defis, setDefis] = useState<DeFiStakingWithClientData[]>([]);

  useEffect(() => {
    let items = result.flatMap((item) => {
      if (!item.data?.stakings) {
        return [];
      }
      return item.data.stakings.map((staking) => ({
        ...staking,
        walletAddress: item.data?.walletAddress!,
        valuation: getDeFiStakingValue(staking, getCachedPrice),
      }));
    });

    items = items.sort((a, b) => b.valuation.total - a.valuation.total);
    setDefis(items);
  }, [result, getCachedPrice]);

  return { defis };
};
