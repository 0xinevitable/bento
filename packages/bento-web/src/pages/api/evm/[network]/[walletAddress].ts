import { EVMBasedNetworks } from '@bento/common';
import { safePromiseAll } from '@bento/common';
import {
  AvalancheChain,
  BNBChain,
  EthereumChain,
  KlaytnChain,
  PolygonChain,
  TokenBalance,
} from '@bento/core/lib/chains';
import { pricesFromCoinMarketCap } from '@bento/core/lib/pricings/CoinMarketCap';
import type { NextApiRequest, NextApiResponse } from 'next';

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

export default async (req: APIRequest, res: NextApiResponse) => {
  // 지갑 목록을 가져온다.
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // 네트워크 주소를 가져온다.
  const network = (req.query.network ?? '').toLowerCase() as EVMBasedNetworks;

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
        if (SUPPORTED_CHAINS.includes(network)) {
          const chain = chains[network]!;

          const getTokenBalances = async (): Promise<TokenBalance[]> =>
            'getTokenBalances' in chain
              ? chain.getTokenBalances(walletAddress)
              : [];

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
  res.status(200).json(result);
};
