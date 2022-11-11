import CompressedJSON from 'compressed-json';

import { createRedisClient } from '@/utils/Redis';

export type CacheVO<DataType extends any> = {
  t: number;
  v: DataType;
};

const getCached = async <DataType extends any>(
  __key: string,
  __redisClient: ReturnType<typeof createRedisClient>,
) => {
  const cachedRawValue = await __redisClient.get(__key);
  if (!cachedRawValue) {
    return null;
  }
  return CompressedJSON.decompress.fromString<DataType>(cachedRawValue);
};

const MINUTES = 60 * 1000;
const DEFAULT_CACHE_TIME = 1 * MINUTES;

type WithCachedOptions<DataType extends any> = {
  defaultValue: DataType;
  redisClient: ReturnType<typeof createRedisClient>;
  ttl?: number;
};

export const withCached = <Params extends Array<any>, DataType extends any>(
  key: string,
  fetcher: (...params: Params) => Promise<DataType>,
  {
    defaultValue,
    redisClient,
    ttl = DEFAULT_CACHE_TIME,
  }: WithCachedOptions<DataType>,
) => {
  return async (...params: Params) => {
    let hasError: boolean = false;
    let data: DataType = defaultValue;
    let cachedTime = 0;

    const cached = await getCached<CacheVO<DataType>>(key, redisClient).catch(
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
        CompressedJSON.compress.toString<CacheVO<DataType>>({
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
