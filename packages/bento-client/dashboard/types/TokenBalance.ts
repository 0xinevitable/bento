import { WalletBalance } from './WalletBalance';

export type DashboardTokenBalance = {
  symbol: string | null;
  name: string;
  logo?: string;
  tokenAddress?: string;
  balances: WalletBalance[];
  netWorth: number;
  amount: number;
  price: number;
  type?: 'nft';
  platform: string;
};
