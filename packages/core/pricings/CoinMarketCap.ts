import { Config, randomOf, safePromiseAllV1 } from '@bento/common';
import axios from 'axios';
import queryString from 'query-string';

import { withCache } from '../cache';

// Not recommended
type CoinMarketCapPriceConversionResponse = {
  status: {
    timestamp: string;
    error_code: number;
    error_message: null;
    elapsed: number;
    credit_count: number;
    notice: null;
  };
  data: {
    id: number;
    symbol: string;
    name: string;
    amount: number;
    last_updated: string;
    quote: {
      USD: {
        price: number;
        last_updated: string;
      };
    };
  };
};

// Should only be called server-side
export const priceFromCoinMarketCap = withCache(
  async (coinMarketCapId: number | string): Promise<number> => {
    const url = queryString.stringifyUrl({
      url: 'https://pro-api.coinmarketcap.com/v2/tools/price-conversion',
      query: {
        CMC_PRO_API_KEY: randomOf(Config.CMC_PRO_API_KEYS),
        amount: 1,
        id: coinMarketCapId,
      },
    });
    const { data } = await axios.get<CoinMarketCapPriceConversionResponse>(url);
    // NOTE: When quering with `symbol` not `id`, `data.data` is Array
    return data.data.quote.USD.price;
  },
);

export const pricesFromCoinMarketCap = async (coinMarketCapIds: number[]) =>
  (
    await safePromiseAllV1(
      coinMarketCapIds.map(async (coinMarketCapId) => {
        const price = await priceFromCoinMarketCap(coinMarketCapId).catch(
          () => 0,
        );
        return { coinMarketCapId, price };
      }),
    )
  ).reduce((acc, cur) => ({ ...acc, [cur.coinMarketCapId]: cur.price }), {});
