import { safePromiseAll } from '@bento/common';
import { pricesFromCoinGecko } from '@bento/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { useCallback } from 'react';

import { useInterval } from '@/hooks/useInterval';

import { Config } from '@/utils';

import { useLazyEffect } from './useLazyEffect';

const SECONDS = 1_000;
const CACHE_TIME = 60 * SECONDS;

type ValueVO = [v: number, t: number];
const buildCacheStore = <T extends any>(prefix: string) => ({
  get: async (key: string): Promise<T | null> => {
    const v = localStorage.getItem(prefix);
    if (!v) {
      return null;
    }
    return JSON.parse(v)[key] || null;
  },
  set: async (key: string, value: T) => {
    const v = localStorage.getItem(prefix);
    const prev = !v ? {} : JSON.parse(v);
    localStorage.setItem(prefix, JSON.stringify({ ...prev, [key]: value }));
  },
});
const CacheStore = buildCacheStore('@pricings');

type PricingMap = Record<string, number>;
export const pricingsAtom = atom<PricingMap>({});
export const coinGeckoIdsAtom = atom<string[]>([]);

const useCoinGeckoPrices = () => {
  const coinGeckoIds = useAtomValue(coinGeckoIdsAtom);
  const [prices, setPrices] = useAtom(pricingsAtom);

  const fetchPrices = useCallback(async () => {
    if (!coinGeckoIds.length) {
      return;
    }

    if (Config.ENVIRONMENT !== 'production') {
      console.log('hit');
    }

    const cachedIds: string[] = [];
    const cachedPrices = await safePromiseAll(
      coinGeckoIds.map(async (coinGeckoId) => {
        const cachedValue = await CacheStore.get(coinGeckoId).catch(() => null);
        if (!cachedValue) {
          return [coinGeckoId, 0];
        }
        const [value, cachedAt] = cachedValue as ValueVO;

        if (cachedAt >= Date.now() - CACHE_TIME) {
          cachedIds.push(coinGeckoId);
          return [coinGeckoId, value];
        }

        return [coinGeckoId, 0];
      }),
    );
    let cachedPricesObject: PricingMap | null = null;
    if (cachedPrices.length > 0) {
      cachedPricesObject = Object.fromEntries(cachedPrices);
      setPrices(cachedPricesObject as PricingMap);
    }

    const cachedIdsSet = new Set(cachedIds);
    const uncachedIds = coinGeckoIds.filter((id) => !cachedIdsSet.has(id));

    const fetchedPrices =
      uncachedIds.length === 0
        ? []
        : await pricesFromCoinGecko(uncachedIds).then((prices) =>
            Object.entries(prices),
          );
    await safePromiseAll(
      fetchedPrices.map(([key, price]) =>
        CacheStore.set(key, [price, Date.now()]),
      ),
    );

    const fetchedPricesObject = Object.fromEntries(fetchedPrices);

    setPrices({
      ...cachedPricesObject,
      ...fetchedPricesObject,
    });
  }, [JSON.stringify(coinGeckoIds)]);

  useLazyEffect(
    () => {
      fetchPrices();
    },
    [fetchPrices],
    2_000,
  );

  useInterval(fetchPrices, CACHE_TIME);

  return prices;
};

export interface GetCachedPrice {
  (coinGeckoId: string): number;
  (coinGeckoIds: string[]): number[];
}
const GetCachedPriceContext = React.createContext<GetCachedPrice>(((
  v: string | string[],
) => (typeof v === 'string' ? 0 : [0])) as GetCachedPrice);

export const PricingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  useCoinGeckoPrices();

  const [prices] = useAtom(pricingsAtom);
  const setCoinGeckoIds = useSetAtom(coinGeckoIdsAtom);

  const getCachedPrice = useCallback(
    (coinGeckoId: string | string[]) => {
      const single = typeof coinGeckoId === 'string';
      const ids = single ? [coinGeckoId] : coinGeckoId;
      const res = ids.map((id) => {
        if (id in prices) {
          return prices[id];
        }
        setCoinGeckoIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        return 0;
      });
      return single ? res[0] : res;
    },
    [prices],
  ) as GetCachedPrice;

  return (
    <GetCachedPriceContext.Provider value={getCachedPrice}>
      {children}
    </GetCachedPriceContext.Provider>
  );
};

export const useCachedPricings = () => {
  const getCachedPrice = React.useContext(GetCachedPriceContext);
  return { getCachedPrice };
};
