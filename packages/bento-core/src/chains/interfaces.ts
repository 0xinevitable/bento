import { Currency } from 'src/pricings/Currency';
import { ERC20TokenInput } from 'src/tokens';

export interface ERC20TokenBalance extends ERC20TokenInput {
  walletAddress: string;
  balance: number;
  price: number;
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
  getTokenBalances?: (address: string) => Promise<ERC20TokenBalance[]>;
}
