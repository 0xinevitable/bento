export type CosmosSDKWalletBalance = {
  walletAddress: string;
  platform: string;

  symbol: string;
  name: string;
  logo: string;

  balance: number;
  delegations: number;
  price: number;
};

export type EVMWalletBalance = {
  walletAddress: string;
  platform: string;

  name: string;
  logo?: string;
  symbol: string;
  address?: string; // for tokens

  balance: number;
  price: number;
  staking?: true;
};

export type SolanaWalletBalance = {
  walletAddress: string;
  platform: string;

  name: string;
  address?: string;
  symbol: string;
  balance: number;
  price: number;
  logo?: string;
};

export type NFTWalletBalance = {
  type: 'nft';
  walletAddress: string;
  platform: string;

  symbol: string | null;
  name: string;
  address?: string;
  balance: number;
  price: number;
  logo?: string;

  assets?: any[];
};

export type WalletBalance =
  | EVMWalletBalance
  | SolanaWalletBalance
  | CosmosSDKWalletBalance
  | NFTWalletBalance;
