export const safePromiseAll = async <T extends any>(promises: Promise<T>[]) =>
  (await Promise.allSettled(promises)).flatMap((res) =>
    res.status === 'fulfilled' ? res.value : [],
  );
