export const safePromiseAll = async <T>(promises: Promise<T>[]) =>
  (await Promise.allSettled(promises)).flatMap((res) =>
    res.status === 'fulfilled' ? res.value : [],
  );

export const shortenAddress = (address: string, size: number = 4) => {
  return `${address.substring(0, 2 + size)}...${address.substring(
    address.length - size,
  )}`;
};
