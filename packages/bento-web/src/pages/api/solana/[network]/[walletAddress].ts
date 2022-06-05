import { SolanaChain } from '@bento/core/lib/chains';
import { safePromiseAll } from '@bento/core/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';

export type WalletBalance = {
  walletAddress: string;
  address?: string;
  symbol: string;
  balance: number;
  price: number;
  logo?: string;
};

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
  // const network = (req.query.network ?? '').toLowerCase() as EVMBasedChains; // Assuming this is Mainnet (Beta)
  const chain = new SolanaChain();

  const result = await safePromiseAll(
    wallets.map(async (walletAddress) => {
      // const getTokenBalances = async (): Promise<ERC20TokenBalance[]> => []

      const [balance, currencyPrice, tokenBalances] = await Promise.all([
        chain.getBalance(walletAddress).catch(() => 0),
        chain.getCurrencyPrice().catch(() => 0),
        // getTokenBalances().catch(() => []),
        [], // Not Implemented
      ]);

      return [
        {
          walletAddress,
          symbol: chain.currency.symbol,
          name: chain.currency.name,
          logo: chain.currency.logo,
          balance,
          price: currencyPrice,
        },
        ...tokenBalances,
      ];
    }),
  );

  res.status(200).json(result);
};
