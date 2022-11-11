import axios from 'axios';

import { ProtocolGetAccount, ProtocolInfo } from '@/_lib/types';

import {
  KOKOS_TOKEN_INFO,
  KSD_ADDRESS,
  KSD_TOKEN_INFO,
  STAKED_KOKOS_ADDRESS,
} from './_constants';

const info: ProtocolInfo = {
  native: false,
  ind: STAKED_KOKOS_ADDRESS,
  name: {
    en: 'Governance',
    ko: '거버넌스',
  },
  conditional: {
    hasToken: STAKED_KOKOS_ADDRESS,
  },
};
export default info;

// NOTE: Rewards are in KSD
export const getAccount: ProtocolGetAccount = async (
  account: string,
  rawTokenBalance?: number,
) => {
  try {
    const { data } = await axios.get<UserGovernanceResponse>(
      `https://prod.kokonut-api.com/govern/users/${account}`,
      {
        timeout: 2_500,
      },
    );
    const balance = (rawTokenBalance || 0) / 10 ** KOKOS_TOKEN_INFO.decimals;

    return [
      {
        prefix: KOKOS_TOKEN_INFO.symbol,
        ind: STAKED_KOKOS_ADDRESS,
        tokens: [{ ...KOKOS_TOKEN_INFO, ind: KOKOS_TOKEN_INFO.address }],
        relatedTokens: [{ ...KSD_TOKEN_INFO, ind: KSD_TOKEN_INFO.address }],
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
              [KOKOS_TOKEN_INFO.address]: Number(
                data?.unstakeInfo.completed || 0,
              ),
            },
          },
          pending: {
            tokenAmounts: {
              [KOKOS_TOKEN_INFO.address]: Number(data?.unstakeInfo.yet || 0),
            },
          },
        },
      },
    ];
  } catch (err) {
    throw err;
  }
};

export type UserGovernanceResponse = {
  unstakeInfo: {
    completed: string; // formatted
    yet: string; // formatted
  };
  ksdReward: string; // formatted
};
