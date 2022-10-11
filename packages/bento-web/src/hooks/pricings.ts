import { safePromiseAll } from '@bento/common';
import { pricesFromCoinGecko } from '@bento/core';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useEffect, useRef } from 'react';

import { useInterval } from '@/hooks/useInterval';

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
  const isInitialFetch = useRef<boolean>(true);

  const coinGeckoIds = useAtomValue(coinGeckoIdsAtom);
  const [prices, setPrices] = useAtom(pricingsAtom);

  const fetchPrices = useCallback(async () => {
    if (!coinGeckoIds.length) {
      return;
    }

    const cachedIds: string[] = [];
    const cachedPrices = await safePromiseAll(
      coinGeckoIds.map(async (coinGeckoId) => {
        const cachedValue = await CacheStore.get(coinGeckoId).catch(() => null);
        if (!cachedValue) {
          return [coinGeckoId, 0];
        }
        const [value, cachedAt] = cachedValue as ValueVO;

        if (!isInitialFetch.current) {
          if (cachedAt >= Date.now() - CACHE_TIME) {
            cachedIds.push(coinGeckoId);
            return [coinGeckoId, value];
          }
        } else {
          isInitialFetch.current = false;
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
    const notCachedIds = coinGeckoIds.filter((id) => !cachedIdsSet.has(id));

    const fetchedPrices =
      notCachedIds.length === 0
        ? []
        : await pricesFromCoinGecko(notCachedIds).then((prices) =>
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

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  useInterval(fetchPrices, CACHE_TIME);

  return prices;
};

export const PricingsProvider: React.FC = () => {
  useCoinGeckoPrices();
  return null;
};

interface GetPrice {
  (coinGeckoId: string): number;
  (coinGeckoIds: string[]): number[];
}
export const usePricings = () => {
  const [prices] = useAtom(pricingsAtom);
  const setCoinGeckoIds = useSetAtom(coinGeckoIdsAtom);

  const getPrice = useCallback(
    (coinGeckoId: string | string[]) => {
      const ids = Array.isArray(coinGeckoId) ? coinGeckoId : [coinGeckoId];

      return ids.map((id) => {
        if (id in prices) {
          return prices[id];
        }
        setCoinGeckoIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        return 0;
      });
    },
    [JSON.stringify(prices)],
  ) as GetPrice;

  return { getPrice };
};

// import { NextPage } from 'next';
// import { useState } from 'react';

// import { PricingsProvider, usePricings } from '@/utils/pricings';

// const Playground: NextPage = () => {
//   const { getPrice } = usePricings();
//   const [cosmos, setCosmos] = useState(false);
//   return (
//     <div
//       className="w-full h-full flex items-center justify-center text-white"
//       style={{ minHeight: '100vh' }}
//     >
//       <PricingsProvider />
//       {JSON.stringify(getPrice(['ethereum', 'bitcoin']))}
//       {cosmos ? getPrice('cosmos')[0] : null}
//       <button
//         onClick={() => {
//           getPrice('cosmos');
//           console.log(getPrice('ethereum'));
//           setCosmos(true);
//         }}
//       >
//         Add ETH
//       </button>
//     </div>
//   );
// };

// export default Playground;
