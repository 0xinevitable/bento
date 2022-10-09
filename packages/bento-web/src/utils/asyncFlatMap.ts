export const asyncFlatMap = async <T extends any, U extends any>(
  array: T[],
  callback: (value: T, index: number, array: T[]) => Promise<[] | U | U[]>,
): Promise<U[]> => {
  const result = await Promise.all(array.map(callback));
  return result.flat() as U[];
};
