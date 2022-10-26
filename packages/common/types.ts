export type WalletType = 'evm' | 'cosmos-sdk' | 'solana';
export const WALLET_TYPES = {
  evm: {
    type: 'evm',
    name: 'EVM',
    logo: '/assets/icons/ethereum.png',
  },
  'cosmos-sdk': {
    type: 'cosmos-sdk',
    name: 'Cosmos SDK',
    logo: '/assets/icons/cosmos-sdk.png',
  },
  solana: {
    type: 'solana',
    name: 'Solana',
    logo: '/assets/icons/solana.png',
  },
};

export type EVMBasedNetworks =
  | 'ethereum'
  | 'bnb'
  | 'avalanche'
  | 'polygon'
  | 'klaytn'
  | 'opensea';
export type CosmosSDKBasedNetworks = 'cosmos-hub' | 'osmosis';

export type Wallet =
  | {
      type: 'evm'; // EVM based chains
      address: string;
      networks: EVMBasedNetworks[];
    }
  | {
      type: 'cosmos-sdk'; // Cosmos SDK based chains
      address: string;
      networks: CosmosSDKBasedNetworks[];
    }
  | { type: 'solana'; address: string };
