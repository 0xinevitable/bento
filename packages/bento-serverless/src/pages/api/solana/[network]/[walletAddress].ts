import { SolanaChain } from '@bento/core/lib/chains';
import { pricesFromCoinGecko } from '@bento/core/lib/pricings/CoinGecko';
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

  const result = (
    await safePromiseAll(
      wallets.map(async (walletAddress) => {
        // const getTokenBalances = async (): Promise<ERC20TokenBalance[]> => []

        const [balance, tokenBalances] = await Promise.all([
          chain.getBalance(walletAddress).catch(() => 0),
          // getTokenBalances().catch(() => []),
          [], // Not Implemented
        ]);

        return [
          {
            walletAddress,
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

  const coinGeckoIds = result
    .flatMap((x) => (!!x.coinGeckoId ? x.coinGeckoId : []))
    .filter((x, i, a) => a.indexOf(x) === i);

  const coinGeckoPricesById = await pricesFromCoinGecko(coinGeckoIds).catch(
    () => ({}),
  );

  result.forEach((token) => {
    if (typeof token.price === 'undefined') {
      if (!!token.coinGeckoId) {
        token.price = coinGeckoPricesById[token.coinGeckoId];
      } else {
        token.price = 0;
      }
    }
  });
  res.status(200).json(result);
};
