import { safePromiseAll } from '@bento/common';

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
import { getSCNRTokenPrice } from './lp';

const provider = klaytnChain._provider;
export const getGovernanceStake = async (
  account: string,
): Promise<DeFiStaking> => {
  const staking = new provider.klay.Contract(
    MINIMAL_ABIS.Staking,
    SCNR_STAKING_ADDRESS,
  );
  const [stakedRawBalance, tokenPrice] = (await safePromiseAll([
    staking.methods.stakedBalanceOf(account, SCNR_TOKEN_INFO.address).call(),
    getSCNRTokenPrice(),
  ])) as [any, number];

  const stakedBalance =
    Number(stakedRawBalance) / 10 ** SCNR_TOKEN_INFO.decimals;

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
    rewards: 'unavailable',
    unstake: 'unavailable',
  };
};
