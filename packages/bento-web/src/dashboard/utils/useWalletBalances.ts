import { Wallet } from '@bento/common';
import { pricesFromCoinGecko } from '@bento/core';
import produce from 'immer';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CosmosSDKWalletBalance,
  EVMWalletBalance,
  SolanaWalletBalance,
} from '@/dashboard/types/WalletBalance';

import { useInterval } from '../../hooks/useInterval';
import { useMultipleRequests } from './useMultipleRequests';

type Key = string;
type Address = string;

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

type Options = {
  wallets: Wallet[];
};

export const useWalletBalances = ({ wallets }: Options) => {
  const calculatedRequests = useMemo(() => {
    // TODO: Clean this thing up
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

    return Object.values(data).reduce(
      (acc, [requestKey, addrs]) => [
        ...acc,
        `${requestKey}/${addrs.join(',')}`,
      ],
      [] as string[],
    );
  }, [wallets]);

  const { responses: result, refetch } =
    useMultipleRequests<
      (EVMWalletBalance | CosmosSDKWalletBalance | SolanaWalletBalance)[]
    >(calculatedRequests);
  useInterval(refetch, 60 * 1_000);

  const balances = useMemo(() => result.flatMap((v) => v.data ?? []), [result]);

  const coinGeckoIds = useMemo<string[]>(
    () =>
      balances
        .flatMap((x) => x.coinGeckoId || [])
        .filter((x, i, a) => a.indexOf(x) === i),
    [result],
  );

  const [coinGeckoPricesByIds, setCoinGeckoPricesByIds] = useState<
    Record<string, number | undefined>
  >({});

  const fetchPrices = useCallback(() => {
    if (!coinGeckoIds.length) {
      return;
    }

    pricesFromCoinGecko(coinGeckoIds)
      .then(setCoinGeckoPricesByIds)
      .catch(() => {});
  }, [JSON.stringify(coinGeckoIds)]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);
  useInterval(fetchPrices, 60 * 1_000);

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
