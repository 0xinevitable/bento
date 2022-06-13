export type CosmosSDKWalletBalance = {
  walletAddress: string;

  symbol: string;
  name: string;
  logo: string;

  balance: number;
  delegations: number;
  price: number;
};

export type EVMWalletBalance = {
  walletAddress: string;

  name: string;
  logo?: string;
  symbol: string;
  address?: string; // for tokens

  balance: number;
  price: number;
};

export type SolanaWalletBalance = {
  walletAddress: string;
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
  symbol: string;
  name: string;
  address?: string;
  balance: number;
  price: number;
  logo?: string;
};

export type WalletBalance =
  | EVMWalletBalance
  | SolanaWalletBalance
  | CosmosSDKWalletBalance
  | NFTWalletBalance;
