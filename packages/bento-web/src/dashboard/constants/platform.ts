export const PLATFORM_LOGOS = {
  ethereum: '/assets/ethereum.png',
  avalanche: '/assets/avalanche.png',
  bnb: 'https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png',
  polygon: '/assets/polygon.webp',
  klaytn: 'https://avatars.githubusercontent.com/u/41137100?s=200&v=4',
  'cosmos-hub':
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png',
  osmosis:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png',
  solana: '/assets/solana.png',
  opensea: '/assets/opensea.png',
};

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
