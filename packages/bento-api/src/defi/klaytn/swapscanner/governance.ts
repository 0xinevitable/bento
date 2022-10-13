import { safePromiseAll } from '@bento/common';

import {
  DeFiStaking,
  KlaytnDeFiProtocolType,
  KlaytnDeFiType,
} from '@/defi/types/staking';

import { klaytnChain } from '../constants';
import { Multicall } from '../utils/Multicall';
import {
  MINIMAL_ABIS,
  SCNR_STAKING_ADDRESS,
  SCNR_TOKEN_INFO,
} from './constants';
import { getSCNRTokenPrice } from './lp';

const provider = klaytnChain._provider;
export const getGovernanceStake = async (
  account: string,
  multicall: Multicall,
): Promise<DeFiStaking> => {
  const staking = new provider.klay.Contract(
    MINIMAL_ABIS.Staking as any,
    SCNR_STAKING_ADDRESS,
  );

  let calls: any[] = [];
  try {
    calls = [
      staking.methods.stakedBalanceOf(account, SCNR_TOKEN_INFO.address),
      staking.methods.withdrawableRewardOf(account, SCNR_TOKEN_INFO.address),
    ];
  } catch (error) {
    console.error(error);
  }

  const [multicallResults, tokenPrice] = (await Promise.all([
    multicall.aggregate(calls),
    getSCNRTokenPrice().catch(() => 0),
  ])) as [any[], number];

  const [stakedRawBalance, claimableRawRewards] = multicallResults.map((v) => {
    if (Array.isArray(v)) {
      return v[0] || '0';
    }
    return '0';
  });
  const stakedBalance =
    Number(stakedRawBalance) / 10 ** SCNR_TOKEN_INFO.decimals;
  const claimableRewards =
    Number(claimableRawRewards) / 10 ** SCNR_TOKEN_INFO.decimals;

  return {
    protocol: KlaytnDeFiProtocolType.SWAPSCANNER,
    type: KlaytnDeFiType.SWAPSCANNER_GOVERNANCE,
    prefix: SCNR_TOKEN_INFO.symbol,
    address: SCNR_STAKING_ADDRESS,
    tokens: [SCNR_TOKEN_INFO],
    wallet: null,
    staked: {
      value: stakedBalance * tokenPrice,
      tokenAmounts: {
        [SCNR_TOKEN_INFO.address]: stakedBalance,
      },
    },
    rewards: {
      value: claimableRewards * tokenPrice,
      tokenAmounts: {
        [SCNR_TOKEN_INFO.address]: claimableRewards,
      },
    },
    unstake: 'unavailable',
  };
};
