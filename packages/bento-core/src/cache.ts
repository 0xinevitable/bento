const MINUTES = 60 * 1000;
const CACHE_TIME = 1 * MINUTES;

export const withCache = <ReturnType extends any, Params extends Array<any>>(
  fetcher: (...params: Params) => ReturnType,
): ((...params: Params) => ReturnType) => {
  const cache: Record<string, { value: any | null; expiresAt: number }> = {};
  return (...params: Params) => {
    const key = JSON.stringify(params);

    if (
      !!cache[key] &&
      cache[key].value &&
      cache[key].expiresAt &&
      cache[key].expiresAt > Date.now()
    ) {
      return cache[key].value;
    }

    if (!cache[key]) {
      cache[key] = { value: null, expiresAt: 0 };
    }

    cache[key].value = null;
    cache[key].value = fetcher(...params);
    cache[key].expiresAt = Date.now() + CACHE_TIME;
    return cache[key].value;
  };
};
