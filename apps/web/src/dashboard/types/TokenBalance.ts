import { BentoSupportedNetwork } from '@/constants/adapters';

export type Indicator = string;

export type TokenInput = {
  type: 'token';
  chain: BentoSupportedNetwork;
  symbol: string;
  name: string;
  decimals: number;
  ind: Indicator;
  logo?: string;
  coinGeckoId?: string;
  coinMarketCapId?: number;
  denomUnits?: { denom: string; exponent: number; aliases?: string[] }[];
};

export type NFTInput = {
  type: 'nft';

  // FIXME: chain to 'ethereum'
  chain: 'opensea';

  symbol: string | null;
  name: string;
  ind: Indicator;
  logo?: string;
  assets?: any[];
};

export type BalanceInfo = {
  account: string;
  balance: number;
  price: number;
};
export type TokenBalance = TokenInput & BalanceInfo;
export type NFTBalance = NFTInput & BalanceInfo;
export type WalletBalance = TokenBalance | NFTBalance;

export type DashboardTokenBalance = {
  symbol: string | null;
  name: string;
  logo?: string;
  tokenAddress?: string;
  balances: WalletBalance[];
  netWorth: number;
  amount: number;
  price: number;
  type: 'nft' | 'token';
  platform: BentoSupportedNetwork | 'opensea';
};
