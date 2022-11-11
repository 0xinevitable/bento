import { TokenInput } from '@bento/core';

type ContractAddressOrDenom = string;
export type AmountWithOptionalValue = {
  value?: number | null;
  lpAmount?: number | null;
  tokenAmounts?: Record<ContractAddressOrDenom, number | undefined> | null;
};

export type NativeInput = Omit<TokenInput, 'address'>;

export type DeFiStaking = {
  prefix?: string;

  // representative contract address
  address: string | null;
  tokens: (TokenInput | NativeInput | null)[];
  relatedTokens?: (TokenInput | NativeInput | null)[];

  wallet: AmountWithOptionalValue | null | 'unavailable';
  staked: AmountWithOptionalValue;
  rewards: AmountWithOptionalValue | null | 'unavailable';
  unstake:
    | {
        claimable: AmountWithOptionalValue | null | 'unavailable';
        pending: AmountWithOptionalValue | null | 'unavailable';
      }
    | null
    | 'unavailable';
};

export type DeFiStakingResponse = {
  account: string;
  stakings: DeFiStaking[];
  cachedTime: number;
};
