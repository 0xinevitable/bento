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
    logo: '/assets/icons/bnb.png',
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
    logo: '/assets/icons/klaytn.png',
  },
  {
    id: 'opensea',
    type: 'evm',
    name: 'OpenSea',
    logo: '/assets/icons/opensea.png',
  },
  {
    id: 'cosmos-hub',
    type: 'cosmos-sdk',
    name: 'Cosmos Hub',
    logo: '/assets/icons/cosmos-hub.png',
  },
  {
    id: 'osmosis',
    type: 'cosmos-sdk',
    name: 'Osmosis',
    logo: '/assets/icons/osmosis.png',
  },
  {
    id: 'solana',
    type: 'sealevel',
    name: 'Solana',
    logo: '/assets/icons/solana.png',
  },
];
