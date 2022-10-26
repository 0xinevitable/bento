import axios from 'axios';
import queryString from 'query-string';

import { withCache } from '../cache';
import { Currency } from './Currency';

type CoinGeckoPricesResponse = {
  result: { [coinGeckoId: string]: number };
};

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
    const { data } = await axios.get<CoinGeckoPricesResponse>(url);
    return data.result[coinGeckoId];
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
  const { data } = await axios.get<CoinGeckoPricesResponse>(url);

  return Object.entries(data.result).reduce(
    (acc, [coinGeckoId, price]) => ({
      ...acc,
      [coinGeckoId]: price,
    }),
    {},
  );
};
