import QueryString from 'query-string';

import { cachedAxios } from './cachedAxios';

// FIXME: Duplicated with @bento/core
export type Currency = 'usd';
export const priceFromCoinGecko = async (
  coinGeckoId: string,
  vsCurrency: Currency = 'usd',
): Promise<number> => {
  const url = QueryString.stringifyUrl({
    url: 'https://api.coingecko.com/api/v3/simple/price',
    query: {
      ids: coinGeckoId,
      vs_currencies: vsCurrency,
    },
  });
  const { data } = await cachedAxios.get(url);
  return data[coinGeckoId][vsCurrency];
};
