type Indicator = string;

export type LocalizedString =
  | string
  | {
      [locale: string]: string;
    };

export type ChainInfo = {
  name: string;
  type: 'evm' | 'sealevel' | 'cosmos-sdk';
};

export type ServiceInfo = {
  native: boolean;
  name: string;
  logo: string;
  url?: string;
  description: LocalizedString;
};

export type ProtocolInfo = {
  native: boolean;
  ind: string | null;
  name: LocalizedString;
};

export type TokenInput = {
  symbol: string;
  name: string;
  decimals: number;
  ind: Indicator; // indicator
  coinGeckoId?: string;
  coinMarketCapId?: number;
  logo?: string;
  staking?: boolean;
  denomUnits?: { denom: string; exponent: number; aliases?: string[] }[];
};

export type AmountWithOptionalValue = {
  value?: number | null;
  lpAmount?: number | null;
  tokenAmounts?: Record<Indicator, number | undefined> | null;
};
export type Balance = AmountWithOptionalValue | null | 'unavailable';

export type ChainAccountInfo = {
  type: 'chain';
  tokens: (TokenInput | null)[];
  wallet: Balance;
};
export type ChainGetAccount = (account: string) => Promise<ChainAccountInfo>;

export type ProtocolAccountInfo = {
  type: 'protocol';
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
) => Promise<ProtocolAccountInfo[]>;

export type BentoChainAdapter = {
  default: ChainInfo;
  getAccount: ChainGetAccount;
};
export type BentoServiceAdapter = {
  default: ServiceInfo;
};
export type BentoProtocolAdapter = {
  default: ProtocolInfo;
  getAccount: ProtocolGetAccount;
};
