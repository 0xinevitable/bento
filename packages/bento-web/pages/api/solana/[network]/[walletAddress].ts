import { safePromiseAll } from '@bento/common';
import { SolanaChain, TokenBalance } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';

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
  const wallets = parseWallets(req.query.walletAddress ?? '');
  const chain = new SolanaChain();

  const redisClient = createRedisClient();
  await redisClient.connect();

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
        const getTokenBalances = async (): Promise<TokenBalance[]> => {
          try {
            const items =
              'getTokenBalances' in chain
                ? await chain.getTokenBalances(walletAddress)
                : [];
            await redisClient
              .set(
                `token-balances:solana:${walletAddress}`,
                JSON.stringify(items),
              )
              .catch((err) => console.error(err));
            return items;
          } catch (error) {
            console.error(
              'Error occurred while fetching token balances (likely Covalent API error)',
              error,
            );
            const out = await redisClient
              .get(`token-balances:solana:${walletAddress}`)
              .catch((err) => {
                console.error(err);
              });
            if (out) {
              return JSON.parse(out);
            }
            return [];
          }
        };

        const [balance, tokenBalances] = await Promise.all([
          chain.getBalance(walletAddress).catch(() => 0),
          getTokenBalances().catch(() => []),
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

  await redisClient.disconnect();
  res.status(200).json(result);
};
