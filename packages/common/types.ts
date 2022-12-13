export type ChainType = 'evm' | 'cosmos-sdk' | 'sealevel';
export const CHAIN_TYPES = {
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
    type: 'sealevel',
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
export type SealevelBasedNetworks = 'solana';

export type Wallet = {
  address: string;
  isVerified: boolean;
} & (
  | { type: 'evm'; networks: EVMBasedNetworks[] }
  | { type: 'cosmos-sdk'; networks: CosmosSDKBasedNetworks[] }
  | { type: 'sealevel'; networks: SealevelBasedNetworks[] }
);

export type BentoAPIResponse<T extends object> = {
  statusCode: number;
  timestamp: string;
  path: string;
  result: T;
};

export type BentoUser = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  profileImage: string;
  bio: string;
  wallets: Wallet[];
};
export type BentoUserResponse = BentoAPIResponse<BentoUser>;
