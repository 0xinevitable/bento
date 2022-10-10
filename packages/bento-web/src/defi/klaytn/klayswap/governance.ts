import {
  DeFiStaking,
  KlaytnDeFiProtocolType,
  KlaytnDeFiType,
} from '@/defi/types/staking';

import { KSP_TOKEN_INFO, VOTING_KSP_ADDRESS } from './constants';

export const getGovernanceStake = async (
  _account: string,
  rawStakedBalance: string,
): Promise<DeFiStaking> => {
  const balance = Number(rawStakedBalance) / 10 ** KSP_TOKEN_INFO.decimals;
  return {
    protocol: KlaytnDeFiProtocolType.KLAYSWAP,
    type: KlaytnDeFiType.KLAYSWAP_GOVERNANCE,
    address: VOTING_KSP_ADDRESS,
    tokens: [KSP_TOKEN_INFO],
    wallet: null,
    staked: {
      tokenAmounts: {
        [KSP_TOKEN_INFO.address]: balance,
      },
    },
    // TODO:
    rewards: 'unavailable',
    unstake: null,
  };
};
