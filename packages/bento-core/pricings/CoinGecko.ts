import axios from 'axios';
import queryString from 'query-string';

import { withCache } from '../cache';
import { Currency } from './Currency';

export const priceFromCoinGecko = withCache(
  async (
    coinGeckoId: string,
    vsCurrency: Currency = 'usd',
  ): Promise<number> => {
    const url = queryString.stringifyUrl({
      url: 'https://bentoapi.io/externals/coingecko/prices',
      query: {
        coinIds: coinGeckoId,
        vsCurrency,
      },
    });
    const { data } = await axios.get(url);
    return data[coinGeckoId][vsCurrency];
  },
);

export const pricesFromCoinGecko = async (
  coinGeckoIds: string[],
  vsCurrency: Currency = 'usd',
): Promise<Record<string, number>> => {
  const url = queryString.stringifyUrl({
    url: 'https://bentoapi.io/externals/coingecko/prices',
    query: {
      coinIds: coinGeckoIds.join(','),
      vsCurrency,
    },
  });
  const { data } = await axios.get<{
    [coinGeckoId: string]: { [vsCurrency: string]: number };
  }>(url);

  return Object.entries(data).reduce(
    (acc, [coinGeckoId, price]) => ({
      ...acc,
      [coinGeckoId]: price[vsCurrency],
    }),
    {},
  );
};
