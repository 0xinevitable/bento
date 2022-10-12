import { CosmosSDKBasedNetworks, safeAsyncFlatMap } from '@bento/common';
import {
  Bech32Address,
  CosmosHubChain,
  CosmosSDKBasedChain,
  OsmosisChain,
  TokenBalance,
} from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    network?: CosmosSDKBasedNetworks;
    walletAddress?: string;
  };
}

const chains: Record<CosmosSDKBasedNetworks, CosmosSDKBasedChain> = {
  'cosmos-hub': new CosmosHubChain(),
  osmosis: new OsmosisChain(),
};

const parseWallets = (mixedQuery: string) => {
  const query = mixedQuery.toLowerCase();
  if (query.indexOf(',') === -1) {
    return [query];
  }
  return query.split(',');
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');
  const network = (
    req.query.network ?? ''
  ).toLowerCase() as CosmosSDKBasedNetworks;

  const result: {
    walletAddress: string;
    symbol: string;
    name: string;
    logo?: string;
    coinGeckoId?: string;
    coinMarketCapId?: number;
    balance: number;
    price?: number;
  }[] = await safeAsyncFlatMap(wallets, async (walletAddress) => {
    const bech32Address = Bech32Address.fromBech32(walletAddress);

    if (['cosmos-hub', 'osmosis'].includes(network)) {
      const chain = chains[network];
      const chainBech32Address = bech32Address.toBech32(
        chain.bech32Config.prefix,
      );

      const getTokenBalances = async (): Promise<TokenBalance[]> =>
        'getTokenBalances' in chain
          ? chain.getTokenBalances?.(chainBech32Address) ?? []
          : [];
      const [balance, delegations, tokenBalances] = await Promise.all([
        chain.getBalance(chainBech32Address).catch(() => 0),
        chain.getDelegations(chainBech32Address).catch(() => 0),
        getTokenBalances(),
      ]);

      return [
        {
          walletAddress: chainBech32Address,
          platform: network,

          symbol: chain.currency.symbol,
          name: chain.currency.name,
          logo: chain.currency.logo,
          coinGeckoId: chain.currency.coinGeckoId,
          balance,
          delegations,
          price: undefined,
        },
        ...tokenBalances,
      ];
    }
    return [];
  });

  res.status(200).json(result);
};

export default withCORS(handler);
