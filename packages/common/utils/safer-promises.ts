export const safePromiseAll = async <T extends any>(promises: Promise<T>[]) =>
  (await Promise.allSettled(promises)).reduce(
    (acc, res) => (res.status === 'fulfilled' ? [...acc, res.value] : acc),
    [] as T[],
  );

/**
 * @deprecated Might not work intended for 2D arrays
 */
export const safePromiseAllV1 = async <T extends any>(promises: Promise<T>[]) =>
  (await Promise.allSettled(promises)).flatMap((res) =>
    res.status === 'fulfilled' ? res.value : [],
  );

export const safeAsyncFlatMap = async <T extends any, U extends any>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => Promise<[] | U | U[]>,
): Promise<U[]> => {
  const result = await Promise.allSettled(array.map(callback));
  return result.flatMap((res) => {
    if (res.status === 'fulfilled') {
      return res.value;
    }
    return [];
  });
};
