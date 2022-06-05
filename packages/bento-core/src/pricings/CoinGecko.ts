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
      url: 'https://api.coingecko.com/api/v3/simple/price',
      query: {
        ids: coinGeckoId,
        vs_currencies: vsCurrency,
      },
    });
    const { data } = await axios.get(url);
    return data[coinGeckoId][vsCurrency];
  },
);
