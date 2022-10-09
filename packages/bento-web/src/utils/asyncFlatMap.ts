export const asyncFlatMap = async <T extends any, U extends any>(
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
