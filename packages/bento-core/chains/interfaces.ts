import { Currency } from '../pricings/Currency';
import { TokenInput } from '../tokens';

export interface TokenBalance extends Omit<TokenInput, 'address'> {
  walletAddress: string;
  balance: number;
  price?: number;
  address?: string;
}

export interface Chain {
  // 기반 통화(Native Token)
  currency: {
    symbol: string;
    name: string;
    logo?: string;
    decimals: number;
    coinGeckoId?: string;
    coinMinimalDenom?: string; // Only for Cosmos SDK based chains
  };
  chainId?: number;
  _provider?: any;
  getCurrencyPrice: (currency?: Currency) => Promise<number>;
  getBalance: (address: string) => Promise<number>;
  getTokenBalances?: (address: string) => Promise<TokenBalance[]>;
}
