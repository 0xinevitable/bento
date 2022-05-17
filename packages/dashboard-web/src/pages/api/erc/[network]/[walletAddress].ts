import type { NextApiRequest, NextApiResponse } from 'next';
import { ERCBasedNetworks } from '@dashboard/core/lib/config';
import { safePromiseAll } from '@dashboard/core/lib/utils';
import {
  Chain,
  EthereumChain,
  KlaytnChain,
  PolygonChain,
} from '@dashboard/core/lib/chains';

export type WalletBalance = {
  walletAddress: string;
  symbol: string;
  balance: number;
  price: number;
};

interface APIRequest extends NextApiRequest {
  query: {
    network?: ERCBasedNetworks;
    walletAddress?: string;
  };
}

const chains: Record<ERCBasedNetworks, Chain> = {
  ethereum: new EthereumChain(),
  polygon: new PolygonChain(),
  klaytn: new KlaytnChain(),
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
  const network = (req.query.network ?? '').toLowerCase() as ERCBasedNetworks;

  const result = await safePromiseAll(
    wallets.map(async (walletAddress) => {
      if (['ethereum', 'polygon', 'klaytn'].includes(network)) {
        const chain = chains[network];
        const [balance, currencyPrice] = await safePromiseAll([
          chain.getBalance(walletAddress),
          chain.getCurrencyPrice(),
        ]);

        return {
          walletAddress,
          symbol: chain.currency.symbol,
          balance,
          price: currencyPrice,
        };
      }
    }),
  );

  res.status(200).json(result);
};
