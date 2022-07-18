import {
  CosmosSDKBasedNetworks,
  EVMBasedNetworks,
  Wallet,
} from '@bento/common';
import { useMemo } from 'react';
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

  return { balances };
};
