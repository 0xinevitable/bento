export const shortenAddress = (address: string, size: number = 4) => {
  return `${address.substring(0, 2 + size)}...${address.substring(
    address.length - size,
  )}`;
};
