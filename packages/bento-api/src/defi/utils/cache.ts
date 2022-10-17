import CompressedJSON from 'compressed-json';

import { createRedisClient } from '@/utils/Redis';

import { DeFiStaking } from '../types/staking';

export type DeFiStakingCacheVO = {
  t: number;
  v: DeFiStaking[];
};
const getCached = async <T extends any>(
  __key: string,
  __redisClient: ReturnType<typeof createRedisClient>,
) => {
  const cachedRawValue = await __redisClient.get(__key);
  if (!cachedRawValue) {
    return null;
  }
  return CompressedJSON.decompress.fromString<T>(cachedRawValue);
};

const MINUTES = 60 * 1000;
const CACHE_TIME = 1 * MINUTES;

export const withCached = async <Params extends Array<any>>(
  key: string,
  redisClient: ReturnType<typeof createRedisClient>,
  fetcher: (...params: Params) => Promise<DeFiStaking[]>,
  ttl = CACHE_TIME,
) => {
  return async (...params: Params) => {
    let hasError: boolean = false;
    let data: DeFiStaking[] = [];
    let cachedTime = 0;

    const cached = await getCached<DeFiStakingCacheVO>(key, redisClient).catch(
      () => null,
    );
    if (!!cached && cached.t >= Date.now() - ttl) {
      // Use cached value if not expired
      data = cached.v;
      cachedTime = cached.t;
      return { data, cachedTime, hasError };
    }

    // else
    try {
      data = await fetcher(...params);
      cachedTime = new Date().getTime();
      await redisClient.set(
        key,
        CompressedJSON.compress.toString<DeFiStakingCacheVO>({
          v: data,
          t: cachedTime,
        }),
      );
    } catch (err) {
      console.error(err);

      if (!cached) {
        hasError = true;
      } else {
        // Use cached value if available
        data = cached.v;
        cachedTime = cached.t;
      }
    }

    return { data, cachedTime, hasError };
  };
};
