import { Config, EVMBasedNetworks, randomOf } from '@bento/common';
import { safePromiseAll } from '@bento/common';
import {
  AvalancheChain,
  BNBChain,
  EthereumChain,
  KlaytnChain,
  PolygonChain,
  TokenBalance,
} from '@bento/core';
import { pricesFromCoinMarketCap } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';
import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    network?: EVMBasedNetworks;
    walletAddress?: string;
  };
}

const chains = {
  ethereum: new EthereumChain(),
  avalanche: new AvalancheChain(),
  bnb: new BNBChain(),
  polygon: new PolygonChain(),
  klaytn: new KlaytnChain(),
  opensea: null,
};
const SUPPORTED_CHAINS = Object.keys(chains).filter(
  (v) => !!chains[v as keyof typeof chains],
);

const parseWallets = (mixedQuery: string) => {
  const query = mixedQuery.toLowerCase();
  if (query.indexOf(',') === -1) {
    return [query];
  }
  return query.split(',');
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');
  const network = (req.query.network ?? '').toLowerCase() as EVMBasedNetworks;

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
    await Promise.all(
      wallets.map(async (walletAddress) => {
        if (SUPPORTED_CHAINS.includes(network)) {
          const chain = chains[network]!;
          const getTokenBalances = async (): Promise<TokenBalance[]> => {
            try {
              const items =
                'getTokenBalances' in chain
                  ? await chain.getTokenBalances(walletAddress)
                  : [];
              await redisClient
                .set(
                  `token-balances:${network}:${walletAddress}`,
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
                .get(`token-balances:${network}:${walletAddress}`)
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
          ]);

          return [
            {
              walletAddress,
              platform: network,

              symbol: chain.currency.symbol,
              name: chain.currency.name,
              logo: chain.currency.logo,
              coinGeckoId: chain.currency.coinGeckoId,
              balance,
              // price: currencyPrice,
            },
            ...tokenBalances,
          ];
        }
        return [];
      }),
    )
  ).flat();

  const coinMarketCapIds = result
    .flatMap((x) => (!!x.coinMarketCapId ? x.coinMarketCapId : []))
    .filter((x, i, a) => a.indexOf(x) === i);

  const coinMarketCapPricesById: Record<string, number | undefined> =
    await pricesFromCoinMarketCap(coinMarketCapIds).catch(() => ({}));

  result.forEach((token) => {
    if (typeof token.price === 'undefined') {
      if (!!token.coinGeckoId) {
        token.price = undefined;
      } else if (!!token.coinMarketCapId) {
        token.price = coinMarketCapPricesById[token.coinMarketCapId];
      } else {
        token.price = 0;
      }
    }
  });

  await redisClient.disconnect();
  res.status(200).json(result);
};

export default withCORS(handler);
