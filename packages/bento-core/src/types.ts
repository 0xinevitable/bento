export type WalletType = 'evm' | 'cosmos-sdk' | 'solana';
export const WALLET_TYPES = {
  evm: {
    type: 'evm',
    name: 'EVM',
    logo: '/assets/ethereum.png',
  },
  'cosmos-sdk': {
    type: 'cosmos-sdk',
    name: 'Cosmos SDK',
    logo: '/assets/cosmos-sdk.png',
  },
  solana: {
    type: 'solana',
    name: 'Solana',
    logo: '/assets/solana.png',
  },
};

export type EVMBasedChains = 'ethereum' | 'polygon' | 'klaytn';
export type CosmosSDKBasedChains = 'cosmos-hub' | 'osmosis';

export type Wallet =
  | {
      type: 'evm'; // EVM based chains
      address: string;
      chains: EVMBasedChains[];
    }
  | {
      type: 'cosmos-sdk'; // Cosmos SDK based chains
      address: string;
      chains: CosmosSDKBasedChains[];
    }
  | { type: 'solana'; address: string };
