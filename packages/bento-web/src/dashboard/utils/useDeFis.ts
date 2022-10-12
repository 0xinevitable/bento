import { Wallet } from '@bento/common';
import { useEffect, useMemo, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';

import {
  Valuation,
  getDeFiStakingValue,
} from '@/defi/klaytn/utils/getDeFiStakingValue';
import { DeFiStaking, DeFiStakingResponse } from '@/defi/types/staking';
import { FeatureFlags } from '@/utils';

import { useMultipleRequests } from './useMultipleRequests';

export type DeFiStakingWithClientData = DeFiStaking & {
  walletAddress: string;
  valuation: Valuation;
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

  return { defis, defisJSONKey: JSON.stringify(defis) };
};
