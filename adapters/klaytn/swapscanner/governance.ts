import { Multicall } from 'klaytn-multicall';

import { ProtocolGetAccount, ProtocolInfo } from '@/_lib/types';

import { klaytnChain } from '../_lib/chain';
import {
  MINIMAL_ABIS,
  SCNR_STAKING_ADDRESS,
  SCNR_TOKEN_INFO,
} from './_constants';
import { getSCNRTokenPrice } from './_lp';

const provider = klaytnChain._provider;
const multicall = new Multicall({ provider });

const info: ProtocolInfo = {
  native: false,
  ind: SCNR_STAKING_ADDRESS,
  name: {
    en: 'Staking',
    ko: '단일 예치',
  },
};
export default info;

export const getAccount: ProtocolGetAccount = async (account: string) => {
  try {
    const staking = new provider.klay.Contract(
      MINIMAL_ABIS.Staking as any,
      SCNR_STAKING_ADDRESS,
    );

    const calls = [
      staking.methods.stakedBalanceOf(account, SCNR_TOKEN_INFO.address),
      staking.methods.withdrawableRewardOf(account, SCNR_TOKEN_INFO.address),
    ];

    const [multicallResults, tokenPrice] = (await Promise.all([
      multicall.aggregate(calls),
      getSCNRTokenPrice().catch(() => 0),
    ])) as [any[], number];

    const [stakedRawBalance, claimableRawRewards] = multicallResults.map(
      (v) => {
        if (Array.isArray(v)) {
          return v[0] || '0';
        }
        return '0';
      },
    );
    const stakedBalance =
      Number(stakedRawBalance) / 10 ** SCNR_TOKEN_INFO.decimals;
    const claimableRewards =
      Number(claimableRawRewards) / 10 ** SCNR_TOKEN_INFO.decimals;

    return [
      {
        prefix: SCNR_TOKEN_INFO.symbol,
        ind: SCNR_STAKING_ADDRESS,
        tokens: [{ ...SCNR_TOKEN_INFO, ind: SCNR_TOKEN_INFO.address }],
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
      },
    ];
  } catch (err) {
    throw err;
  }
};
