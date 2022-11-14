import { Currency } from '@bento/core';

export type TokenInput = {
  symbol: string;
  name: string;
  decimals: number;
  ind: Indicator;
  logo?: string;
  coinGeckoId?: string;
  coinMarketCapId?: number;
  denomUnits?: { denom: string; exponent: number; aliases?: string[] }[];
};

export type TokenBalance = TokenInput & {
  balance: number;
  price?: number;
};

export interface Chain {
  currency: TokenInput;
  chainId?: number;
  _provider?: any;
  getCurrencyPrice: (currency?: Currency) => Promise<number>;
  getBalance: (account: string) => Promise<TokenBalance>;
  getTokenBalances: (account: string) => Promise<TokenBalance[]>;
}

type Indicator = string;

export type LocalizedString =
  | string
  | {
      [locale: string]: string;
    };

export type ChainInfo =
  | {
      name: string;
      type: 'cosmos-sdk';
      bech32Config: {
        prefix: string;
      };
    }
  | {
      name: string;
      type: 'evm' | 'sealevel';
    };

export type ServiceInfo = {
  native: boolean;
  name: LocalizedString;
  logo?: string;
  url?: string;
  description: LocalizedString;
};

export type ProtocolInfo = {
  native: boolean;
  ind: string | null;
  name: LocalizedString;
  conditional?: {
    hasToken?: string;
    passAllBalances?: boolean;
  };
};

export type AmountWithOptionalValue = {
  value?: number | null;
  lpAmount?: number | null;
  tokenAmounts?: Record<Indicator, number | undefined> | null;
};
export type Balance = AmountWithOptionalValue | null | 'unavailable';

export type ChainAccountInfo = {
  tokens: (TokenInput | null)[];
  wallet: Balance;
};
export type ChainGetAccount = (account: string) => Promise<TokenBalance[]>;

export type ProtocolAccountInfo = {
  delegator?: LocalizedString;
  prefix?: string;
  native?: boolean;

  ind: Indicator | null; // indicator (ex> representative contract address)
  tokens: (TokenInput | null)[];
  relatedTokens?: (TokenInput | null)[];

  wallet: Balance;
  staked: Balance;
  rewards: Balance;
  unstake:
    | {
        claimable: Balance;
        pending: Balance;
      }
    | null
    | 'unavailable';
};
export type ProtocolGetAccount = (
  account: string,
  rawTokenBalance?: number,
  allRawTokenBalances?: Record<string, number>,
) => Promise<ProtocolAccountInfo[]>;

export type BentoChainAdapter = {
  default: ChainInfo;
  getAccount: ChainGetAccount;
  TEST_ADDRESS?: string;
};
export type BentoServiceAdapter = {
  default: ServiceInfo;
};
export type BentoProtocolAdapter = {
  default: ProtocolInfo;
  getAccount: ProtocolGetAccount;
};
