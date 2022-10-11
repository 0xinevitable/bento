import { Wallet } from '@bento/common';
import produce from 'immer';
import { useMemo } from 'react';

import { usePricings } from '@/hooks/pricings';

import { KEYS_BY_NETWORK } from '@/constants/networks';
import {
  CosmosSDKWalletBalance,
  EVMWalletBalance,
  SolanaWalletBalance,
} from '@/dashboard/types/WalletBalance';

import { useInterval } from '../../hooks/useInterval';
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
  const { getPrice } = usePricings();

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
  }, [JSON.stringify(wallets)]);

  const { responses: result, refetch } =
    useMultipleRequests<
      (EVMWalletBalance | CosmosSDKWalletBalance | SolanaWalletBalance)[]
    >(calculatedRequests);
  useInterval(refetch, 60 * 1_000);

  const balances = useMemo(() => result.flatMap((v) => v.data ?? []), [result]);
  const balancesWithPrices = useMemo(
    () =>
      produce(balances, (draft) => {
        draft.forEach((token) => {
          if (typeof token.price === 'undefined') {
            if (!!token.coinGeckoId) {
              token.price = getPrice(token.coinGeckoId);
            } else {
              token.price = 0;
            }
          }
        });
      }),
    [balances, getPrice],
  );

  return {
    balances: balancesWithPrices,
    jsonKey: JSON.stringify(balancesWithPrices),
  };
};
