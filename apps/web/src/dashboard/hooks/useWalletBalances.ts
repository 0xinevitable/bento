import { Wallet } from '@bento/common';
import produce from 'immer';
import { useEffect, useMemo, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';

import { BentoSupportedNetwork } from '@/constants/adapters';

import { useInterval } from '../../hooks/useInterval';
import { TokenBalance } from '../types/TokenBalance';
import { useMultipleRequests } from './useMultipleRequests';

type Key = string;
type Address = string;

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type Options = {
  wallets: Wallet[];
};

export const useWalletBalances = ({ wallets }: Options) => {
  const { getCachedPrice } = useCachedPricings();

  const calculatedRequests = useMemo(() => {
    // TODO: Clean this thing up
    const data: PartialRecord<BentoSupportedNetwork, [Key, Address[]]> = {};

    wallets.forEach((wallet) => {
      wallet.networks.forEach((network) => {
        if (network === 'opensea') {
          return;
        }
        const previousAddrs = data[network]?.[1] ?? [];
        data[network] = [
          `/api/balances/${network}`,
          [...previousAddrs, wallet.address],
        ];
      });
    });

    return Object.values(data).reduce(
      (acc, [requestKey, addrs]) => [
        ...acc,
        `${requestKey}/${addrs.join(',')}`,
      ],
      [] as string[],
    );
  }, [JSON.stringify(wallets)]);

  const { responses: result, refetch } = useMultipleRequests<TokenBalance[]>(
    calculatedRequests,
    undefined,
    (key, data) =>
      data.map((v) => ({
        ...v,
        type: 'token',
        chain: key.split('/')[3] as BentoSupportedNetwork,
      })),
  );
  useInterval(refetch, 60 * 1_000);

  const balances = useMemo(() => result.flatMap((v) => v.data ?? []), [result]);
  const [balancesWithPrices, setBalancesWithPrices] = useState<TokenBalance[]>(
    [],
  );

  useEffect(() => {
    const result = produce(balances, (draft) => {
      draft.forEach((token) => {
        if (typeof token.price === 'undefined') {
          if (!!token.coinGeckoId) {
            token.price = getCachedPrice(token.coinGeckoId);
          } else {
            token.price = 0;
          }
        }
      });
    });
    setBalancesWithPrices(result);
  }, [balances, getCachedPrice]);

  return {
    balances: balancesWithPrices,
  };
};
