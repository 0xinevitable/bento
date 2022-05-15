import type { NextApiRequest, NextApiResponse } from 'next';
import { TendermintBasedChains } from '@dashboard/core/lib/config';
import { Bech32Address } from '@dashboard/core/lib/bech32';
import { safePromiseAll } from '@dashboard/core/lib/utils';
import {
  CosmosHubChain,
  OsmosisChain,
  TendermintChain,
} from '@dashboard/core/lib/chains';

export type WalletBalance = {
  walletAddress: string;
  symbol: string;
  balance: number;
  price: number;
};

interface APIRequest extends NextApiRequest {
  query: {
    network?: TendermintBasedChains;
    walletAddress?: string;
  };
}

const chains: Record<TendermintBasedChains, TendermintChain> = {
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
  ).toLowerCase() as TendermintBasedChains;

  const result = await safePromiseAll(
    wallets.map(async (walletAddress) => {
      const bech32Address = Bech32Address.fromBech32(walletAddress);

      if (['cosmos-hub', 'osmosis'].includes(network)) {
        const chain = chains[network];
        const balance = await chain.getBalance(
          bech32Address.toBech32(chain.bech32Config.prefix),
        );
        const currencyPrice = await chain.getCurrencyPrice();

        return {
          walletAddress: bech32Address,
          symbol: chain.currency.symbol,
          balance,
          price: currencyPrice,
        };
      }
    }),
  );

  res.status(200).json(result);
};
