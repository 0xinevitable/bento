import { TokenInput } from '@bento/core';

export enum OsmosisDeFiType {
  ION_Governance = 'ion_g',
  // ION_IBC = 'ion_ibc',
}

export enum KlaytnDeFiType {
  // KlaySwap(KLAYswap)
  KLAYSWAP_LP = 'ks_lp',
  KLAYSWAP_GOVERNANCE = 'ks_g',
  KLAYSWAP_LEVERAGE_SINGLE = 'ks_l_s',
  // KLAYSWAP_LEVERAGE_PLUS = 'ks_l_p',

  // KokonutSwap
  KOKONUTSWAP_LP = 'kks_lp',
  KOKONUTSWAP_GOVERNANCE = 'kks_g',
}

export type DeFiType = KlaytnDeFiType | OsmosisDeFiType;

export type AmountWithOptionalValue = {
  amount: number;
  value: number | null;
};

export type DeFiStaking = {
  type: DeFiType;
  name: string;
  tokens: (TokenInput | null)[];
  wallet: AmountWithOptionalValue | null;
  staked: AmountWithOptionalValue;
  rewards: AmountWithOptionalValue | null;
  unstake: {
    claimable: AmountWithOptionalValue;
    pending: AmountWithOptionalValue;
  } | null;
};
