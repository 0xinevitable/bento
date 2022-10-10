import {
  DeFiStaking,
  KlaytnDeFiProtocolType,
  KlaytnDeFiType,
} from '@/defi/types/staking';

import { klaytnChain } from '../constants';
import {
  MINIMAL_ABIS,
  SCNR_STAKING_ADDRESS,
  SCNR_TOKEN_INFO,
} from './constants';

const provider = klaytnChain._provider;
export const getGovernanceStake = async (
  account: string,
): Promise<DeFiStaking> => {
  const staking = new provider.klay.Contract(
    MINIMAL_ABIS.Staking,
    SCNR_STAKING_ADDRESS,
  );
  const stakedBalance = await staking.methods
    .stakedBalanceOf(account, SCNR_TOKEN_INFO.address)
    .call();

  return {
    protocol: KlaytnDeFiProtocolType.SWAPSCANNER,
    type: KlaytnDeFiType.SWAPSCANNER_GOVERNANCE,
    prefix: SCNR_TOKEN_INFO.symbol,
    address: SCNR_STAKING_ADDRESS,
    tokens: [SCNR_TOKEN_INFO],
    wallet: null,
    staked: {
      tokenAmounts: {
        [SCNR_TOKEN_INFO.address]: stakedBalance,
      },
    },
    rewards: 'unavailable',
    unstake: 'unavailable',
  };
};
