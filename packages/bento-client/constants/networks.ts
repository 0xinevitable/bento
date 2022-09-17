export const KEYS_BY_NETWORK = {
  ethereum: '/api/evm/ethereum',
  bnb: '/api/evm/bnb',
  avalanche: '/api/evm/avalanche',
  polygon: '/api/evm/polygon',
  klaytn: '/api/evm/klaytn',
  'cosmos-hub': '/api/cosmos-sdk/cosmos-hub',
  osmosis: '/api/cosmos-sdk/osmosis',
  solana: '/api/solana/mainnet',
} as const;

export type Network = {
  id: string;
  type: string;
  name: string;
  logo: string;
};
export const NETWORKS: Network[] = [
  {
    id: 'ethereum',
    type: 'evm',
    name: 'Ethereum',
    logo: '/assets/icons/ethereum.png',
  },
  {
    id: 'avalanche',
    type: 'evm',
    name: 'Avalanche',
    logo: '/assets/icons/avalanche.png',
  },
  {
    id: 'bnb',
    type: 'evm',
    name: 'BNB',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png',
  },
  {
    id: 'polygon',
    type: 'evm',
    name: 'Polygon',
    logo: '/assets/icons/polygon.png',
  },
  {
    id: 'klaytn',
    type: 'evm',
    name: 'Klaytn',
    logo: 'https://avatars.githubusercontent.com/u/41137100?s=200&v=4',
  },
  {
    id: 'opensea',
    type: 'evm',
    name: 'OpenSea',
    logo: '/assets/icons/opensea.png',
  },
  {
    id: 'cosmos',
    type: 'cosmos-sdk',
    name: 'Cosmos',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/cosmos/info/logo.png',
  },
  {
    id: 'osmosis',
    type: 'cosmos-sdk',
    name: 'Osmosis',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/osmosis/info/logo.png',
  },
  {
    id: 'solana',
    type: 'solana',
    name: 'Solana',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png',
  },
];
