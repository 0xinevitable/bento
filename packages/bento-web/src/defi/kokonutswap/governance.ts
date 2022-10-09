import { axios } from '@/utils';

import { DeFiStaking, KlaytnDeFiType } from '../types/staking';
import {
  KOKOS_TOKEN_INFO,
  KSD_ADDRESS,
  STAKED_KOKOS_ADDRESS,
} from './constants';

// NOTE: Rewards are in KSD
export const getGovernanceStake = async (
  account: string,
  rawStakedBalance: string,
): Promise<DeFiStaking> => {
  const { data } = await axios
    .get<UserGovernanceResponse>(
      `https://prod.kokonut-api.com/govern/users/${account}`,
      {
        timeout: 2_500,
      },
    )
    .catch(() => ({ data: null }));
  const balance = Number(rawStakedBalance) / 10 ** KOKOS_TOKEN_INFO.decimals;

  return {
    type: KlaytnDeFiType.KOKONUTSWAP_GOVERNANCE,
    address: STAKED_KOKOS_ADDRESS,
    tokens: [KOKOS_TOKEN_INFO],
    wallet: null,
    staked: {
      tokenAmounts: {
        [KOKOS_TOKEN_INFO.address]: balance,
      },
    },
    // TODO:
    rewards: {
      tokenAmounts: {
        [KSD_ADDRESS]: Number(data?.ksdReward || 0),
      },
    },
    unstake: {
      claimable: {
        tokenAmounts: {
          [KOKOS_TOKEN_INFO.address]: Number(data?.unstakeInfo.completed || 0),
        },
      },
      pending: {
        tokenAmounts: {
          [KOKOS_TOKEN_INFO.address]: Number(data?.unstakeInfo.yet || 0),
        },
      },
    },
  };
};

export type UserGovernanceResponse = {
  unstakeInfo: {
    completed: string; // formatted
    yet: string; // formatted
  };
  ksdReward: string; // formatted
};
