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
  value?: number | null;
};

export type DeFiStaking = {
  type: DeFiType;
  name: string;
  tokens: (TokenInput | null)[];
  wallet: AmountWithOptionalValue | null;
  staked: AmountWithOptionalValue;
  rewards: AmountWithOptionalValue | null | 'unavailable';
  unstake: {
    claimable: AmountWithOptionalValue;
    pending: AmountWithOptionalValue;
  } | null;
};

export const Examples: Record<string, DeFiStaking> = {
  LP: {
    type: KlaytnDeFiType.KLAYSWAP_LP,
    name: 'KLAYswap LP',
    tokens: [],
    wallet: {
      amount: 0.005,
    }, // 0.005 LP tokens have not been staked, but exist in wallet
    staked: {
      amount: 1000,
      value: null,
    },
    rewards: 'unavailable', // Rewards are not catched by us
    unstake: null, // Unstaking period does not exist
  },
  MINIMAL: {
    type: KlaytnDeFiType.KLAYSWAP_LP,
    name: 'KLAYswap LP',
    tokens: [],
    wallet: null, // LP tokens cannot exist in wallet unstaked
    staked: { amount: 1000 },
    rewards: null, // Rewards are not distributed
    unstake: null, // Unstaking period does not exist
  },
};
