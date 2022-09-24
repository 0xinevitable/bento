import { safePromiseAll } from '@bento/common';
import { SolanaChain } from '@bento/core/chains';
import type { NextApiRequest, NextApiResponse } from 'next';

interface APIRequest extends NextApiRequest {
  query: {
    network?: 'mainnet';
    walletAddress?: string;
  };
}

// NOTE: Solana wallet address is CASE SENSITIVE
const parseWallets = (query: string) => {
  if (query.indexOf(',') === -1) {
    return [query];
  }
  return query.split(',');
};

export default async (req: APIRequest, res: NextApiResponse) => {
  // 지갑 목록을 가져온다.
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // 네트워크 주소를 가져온다.
  // const network = (req.query.network ?? '').toLowerCase() as EVMBasedNetworks; // Assuming this is Mainnet (Beta)
  const chain = new SolanaChain();

  const result: {
    walletAddress: string;
    symbol: string;
    name: string;
    logo?: string;
    coinGeckoId?: string;
    coinMarketCapId?: number;
    balance: number;
    price?: number;
  }[] = (
    await safePromiseAll(
      wallets.map(async (walletAddress) => {
        const [balance, tokenBalances] = await Promise.all([
          chain.getBalance(walletAddress).catch(() => 0),
          chain.getTokenBalances(walletAddress).catch(() => []),
          [],
        ]);

        return [
          {
            walletAddress,
            platform: 'solana',

            symbol: chain.currency.symbol,
            name: chain.currency.name,
            logo: chain.currency.logo,
            coinGeckoId: chain.currency.coinGeckoId,
            balance,
            price: undefined,
          },
          ...tokenBalances,
        ];
      }),
    )
  ).flat();

  res.status(200).json(result);
};
