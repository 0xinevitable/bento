import { Currency } from '../pricings/Currency';
import { TokenInput } from '../tokens';

export interface TokenBalance extends Omit<TokenInput, 'address'> {
  walletAddress: string;
  balance: number;
  price?: number;
  address?: string;
}

export type NativeInput = Omit<TokenInput, 'address'>;

export interface Chain {
  // 기반 통화(Native Token)
  currency: NativeInput;
  chainId?: number;
  _provider?: any;
  getCurrencyPrice: (currency?: Currency) => Promise<number>;
  getBalance: (address: string) => Promise<number>;
  getTokenBalances?: (address: string) => Promise<TokenBalance[]>;
}
