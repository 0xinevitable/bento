export type CosmosSDKWalletBalance = {
  account: string;
  platform: string;

  symbol: string;
  name: string;
  logo: string;

  balance: number;
  price: number;
  coinGeckoId?: string;
};

export type EVMWalletBalance = {
  account: string;
  platform: string;

  name: string;
  logo?: string;
  symbol: string;
  address?: string; // for tokens

  balance: number;
  price: number;
  coinGeckoId?: string;
};

export type SolanaWalletBalance = {
  account: string;
  platform: string;

  name: string;
  address?: string;
  symbol: string;
  balance: number;
  price: number;
  logo?: string;
  coinGeckoId?: string;
};

export type NFTWalletBalance = {
  type: 'nft';
  account: string;
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
