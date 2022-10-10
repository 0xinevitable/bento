import { TokenInput } from '@bento/core';

export enum OsmosisDeFiType {
  ION_Governance = 'ion_g',
  // ION_IBC = 'ion_ibc',
}

export enum KlayStationNodes {
  KLAYSTATION_NODE_HASHED_AND_OZYS = 'kstn_n_hno',
  KLAYSTATION_NODE_KED = 'kstn_n_ked',
  KLAYSTATION_NODE_FSN = 'kstn_n_fsn',
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

  // KlayStation Node Delegation
  KLAYSTATION_NODE_HASHED_AND_OZYS = 'kstn_n_hno',
  KLAYSTATION_NODE_KED = 'kstn_n_ked',
  KLAYSTATION_NODE_FSN = 'kstn_n_fsn',
}

export type DeFiType = KlaytnDeFiType | OsmosisDeFiType;

type ContractAddressOrDenom = string;
export type AmountWithOptionalValue = {
  value?: number | null;
  lpAmount?: number | null;
  tokenAmounts?: Record<ContractAddressOrDenom, number | undefined> | null;
};

export type NativeInput = Omit<TokenInput, 'address'>;

export type DeFiStaking = {
  type: DeFiType;

  // representative contract address
  address: string;
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

export const Examples: Record<string, DeFiStaking> = {
  LP: {
    type: KlaytnDeFiType.KLAYSWAP_LP,
    address: '',
    tokens: [],
    wallet: {
      lpAmount: 0.005,
    }, // 0.005 LP tokens have not been staked, but exist in wallet
    staked: {
      lpAmount: 1000,
      value: null,
    },
    rewards: 'unavailable', // Rewards are not catched by us
    unstake: null, // Unstaking period does not exist
  },
  MINIMAL: {
    type: KlaytnDeFiType.KLAYSWAP_LP,
    address: '0x00',
    tokens: [],
    wallet: null, // LP tokens cannot exist in wallet unstaked
    staked: { tokenAmounts: { '0x00': 1000 } },
    rewards: null, // Rewards are not distributed
    unstake: null, // Unstaking period does not exist
  },
};
