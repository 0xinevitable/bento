import {
  Chain,
  ERC20TokenBalance,
  EthereumChain,
  KlaytnChain,
  PolygonChain,
} from '@bento/core/lib/chains';
import { EVMBasedChains } from '@bento/core/lib/types';
import { safePromiseAll } from '@bento/core/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export type WalletBalance = {
  walletAddress: string;
  symbol: string;
  balance: number;
  price: number;
  logo?: string;
};

interface APIRequest extends NextApiRequest {
  query: {
    network?: EVMBasedChains;
    walletAddress?: string;
  };
}

const chains: Record<EVMBasedChains, Chain> = {
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
  // 지갑 목록을 가져온다.
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // 네트워크 주소를 가져온다.
  const network = (req.query.network ?? '').toLowerCase() as EVMBasedChains;

  const result = await safePromiseAll(
    wallets.map(async (walletAddress) => {
      if (['ethereum', 'polygon', 'klaytn'].includes(network)) {
        const chain = chains[network];

        const getTokenBalances = async (): Promise<ERC20TokenBalance[]> =>
          !!chain.getTokenBalances ? chain.getTokenBalances(walletAddress) : [];

        const [balance, currencyPrice, tokenBalances] = await Promise.all([
          chain.getBalance(walletAddress).catch(() => 0),
          chain.getCurrencyPrice().catch(() => 0),
          getTokenBalances().catch(() => []),
        ]);

        return [
          {
            walletAddress,
            symbol: chain.currency.symbol,
            balance,
            price: currencyPrice,
          },
          ...tokenBalances,
        ];
      }
    }),
  );

  res.status(200).json(result);
};
