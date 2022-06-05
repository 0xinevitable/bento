import { Bech32Address } from '@bento/core/lib/bech32';
import {
  CosmosHubChain,
  CosmosSDKBasedChain,
  OsmosisChain,
} from '@bento/core/lib/chains';
import { CosmosSDKBasedChains } from '@bento/core/lib/types';
import { safePromiseAll } from '@bento/core/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export type WalletBalance = {
  walletAddress: string;

  symbol: string;
  name: string;
  logo: string;

  balance: number;
  delegations: number;
  price: number;
};

interface APIRequest extends NextApiRequest {
  query: {
    network?: CosmosSDKBasedChains;
    walletAddress?: string;
  };
}

const chains: Record<CosmosSDKBasedChains, CosmosSDKBasedChain> = {
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

export default async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');
  const network = (
    req.query.network ?? ''
  ).toLowerCase() as CosmosSDKBasedChains;

  const result = await safePromiseAll(
    wallets.map(async (walletAddress) => {
      const bech32Address = Bech32Address.fromBech32(walletAddress);

      if (['cosmos-hub', 'osmosis'].includes(network)) {
        const chain = chains[network];
        const chainBech32Address = bech32Address.toBech32(
          chain.bech32Config.prefix,
        );
        const [balance, delegations, currencyPrice] = await safePromiseAll([
          chain.getBalance(chainBech32Address).catch(() => 0),
          chain.getDelegations(chainBech32Address).catch(() => 0),
          chain.getCurrencyPrice().catch(() => 0),
        ]);

        return {
          walletAddress: chainBech32Address,
          symbol: chain.currency.symbol,
          name: chain.currency.name,
          logo: chain.currency.logo,
          balance,
          delegations,
          price: currencyPrice,
        };
      }
    }),
  );

  res.status(200).json(result);
};
