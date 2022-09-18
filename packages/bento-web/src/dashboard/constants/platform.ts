export const displayName = (platform: string) => {
  if (platform === 'opensea') {
    return 'OpenSea NFTs';
  }
  if (platform === 'bnb') {
    return 'BNB';
  }
  if (platform === 'cosmos-hub') {
    return 'Cosmos Hub';
  }
  return platform.charAt(0).toUpperCase() + platform.slice(1);
};
