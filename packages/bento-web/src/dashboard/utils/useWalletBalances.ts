import {
  CosmosSDKBasedNetworks,
  EVMBasedNetworks,
  Wallet,
} from '@bento/common';
import { pricesFromCoinGecko } from '@bento/core/lib/pricings/CoinGecko';
import produce from 'immer';
import { useEffect, useMemo, useState } from 'react';
import { SWRResponse } from 'swr';

import { useAxiosSWR } from '@/hooks/useAxiosSWR';

import {
  CosmosSDKWalletBalance,
  EVMWalletBalance,
  SolanaWalletBalance,
} from '../types/WalletBalance';

type Key = string;
type Address = string;
type Query = string;

export const KEYS_BY_NETWORK = {
  ethereum: '/api/evm/ethereum',
  bnb: '/api/evm/bnb',
  avalanche: '/api/evm/avalanche',
  polygon: '/api/evm/polygon',
  klaytn: '/api/evm/klaytn',
  'cosmos-hub': '/api/cosmos-sdk/cosmos-hub',
  osmosis: '/api/cosmos-sdk/osmosis',
  solana: '/api/solana/mainnet',
} as const;

type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

type Requests = PartialRecord<
  EVMBasedNetworks | CosmosSDKBasedNetworks | 'solana',
  [string, string]
>;

const useSWRs = <T extends any>(
  requests: Requests,
  hook: typeof useAxiosSWR,
) => {
  const keys = Object.keys(KEYS_BY_NETWORK) as (keyof typeof KEYS_BY_NETWORK)[];
  const res: SWRResponse<T, any>[] = [];
  for (const key of keys) {
    const req = requests[key];
    const url = !req ? null : `${req[0]}/${req[1]}`;
    const result = hook<T>(url);
    res.push(result);
  }
  return res;
};

type Options = {
  wallets: Wallet[];
};

export const useWalletBalances = ({ wallets }: Options) => {
  const calculatedRequests = useMemo(() => {
    const data: PartialRecord<keyof typeof KEYS_BY_NETWORK, [Key, Address[]]> =
      {};

    wallets.forEach((wallet) => {
      if (wallet.type === 'solana') {
        const previousAddrs = data[wallet.type]?.[1] ?? [];
        data[wallet.type] = [
          KEYS_BY_NETWORK[wallet.type],
          [...previousAddrs, wallet.address],
        ];
        return;
      }
      wallet.networks.forEach((network) => {
        if (network === 'opensea') {
          return;
        }
        const previousAddrs = data[network]?.[1] ?? [];
        data[network] = [
          KEYS_BY_NETWORK[network],
          [...previousAddrs, wallet.address],
        ];
      });
    });

    return Object.entries(data).reduce(
      (acc, [platform, [requestKey, addrs]]) => ({
        ...acc,
        [platform]: [requestKey, addrs.join(',')],
      }),
      {} as PartialRecord<keyof typeof KEYS_BY_NETWORK, [Key, Query]>,
    );
  }, [wallets]);

  const result = useSWRs<
    (EVMWalletBalance | CosmosSDKWalletBalance | SolanaWalletBalance)[]
  >(calculatedRequests, useAxiosSWR);

  const balances = useMemo(() => result.flatMap((v) => v.data ?? []), [result]);

  const coinGeckoIds = useMemo<string[]>(() => {
    if (result.some((v) => v.isLoading)) {
      return [];
    }
    return balances
      .flatMap((x) => x.coinGeckoId || [])
      .filter((x, i, a) => a.indexOf(x) === i);
  }, [result]);

  const [coinGeckoPricesByIds, setCoinGeckoPricesByIds] = useState<
    Record<string, number | undefined>
  >({});
  useEffect(() => {
    if (!coinGeckoIds.length) {
      return;
    }
    pricesFromCoinGecko(coinGeckoIds)
      .then(setCoinGeckoPricesByIds)
      .catch(() => {});
  }, [coinGeckoIds]);

  const balancesWithPrices = useMemo(
    () =>
      produce(balances, (draft) => {
        draft.forEach((token) => {
          if (typeof token.price === 'undefined') {
            if (!!token.coinGeckoId) {
              token.price = coinGeckoPricesByIds[token.coinGeckoId] ?? 0;
            } else {
              token.price = 0;
            }
          }
        });
      }),
    [balances, coinGeckoPricesByIds],
  );

  return { balances: balancesWithPrices };
};
