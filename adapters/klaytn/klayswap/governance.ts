import { ProtocolGetAccount, ProtocolInfo } from '@/_lib/types';

import { KSP_TOKEN_INFO, VOTING_KSP_ADDRESS } from './_constants';

const info: ProtocolInfo = {
  native: false,
  ind: VOTING_KSP_ADDRESS,
  name: {
    en: 'Governance',
    ko: '거버넌스',
  },
  conditional: {
    hasToken: VOTING_KSP_ADDRESS,
  },
};
export default info;

export const getAccount: ProtocolGetAccount = async (
  _account: string,
  rawTokenBalance?: number,
) => {
  try {
    const balance = (rawTokenBalance || 0) / 10 ** KSP_TOKEN_INFO.decimals;
    return [
      {
        prefix: KSP_TOKEN_INFO.symbol,
        ind: VOTING_KSP_ADDRESS,
        tokens: [{ ...KSP_TOKEN_INFO, ind: KSP_TOKEN_INFO.address }],
        wallet: null,
        staked: {
          tokenAmounts: {
            [KSP_TOKEN_INFO.address]: balance,
          },
        },
        // TODO:
        rewards: 'unavailable',
        unstake: null,
      },
    ];
  } catch (err) {
    throw err;
  }
};
