export const safePromiseAll = async <T>(promises: Promise<T>[]) =>
  (await Promise.allSettled(promises)).flatMap((res) =>
    res.status === 'fulfilled' ? res.value : [],
  );
