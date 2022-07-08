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

export const MinimalABIs = {
  ERC20: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'who',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      type: 'function',
    },
  ],
  LP: [
    {
      inputs: [],
      name: 'getReserves',
      outputs: [
        { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
        { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
        { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
      ],
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
  Staking: [
    {
      inputs: [
        { internalType: 'address', name: '', type: 'address' },
        {
          internalType: 'contract IERC20Upgradeable',
          name: '',
          type: 'address',
        },
      ],
      name: 'stakedBalanceOf',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
};
