import { ZERO_ADDRESS } from '@bento/core';

import { DeFiStaking } from '@/_lib/types/staking';

import { klaytnChain } from '../_lib/chain';
import {
  NODE_TYPE__BY_CONTRACT_ADDRESS,
  PROTOCOL_ABI,
  PROTOCOL_ADDRESS,
} from './constants';

export const getDelegations = async (
  provider: any,
  account: string,
): Promise<DeFiStaking[]> => {
  const protocol = new provider.klay.Contract(PROTOCOL_ABI, PROTOCOL_ADDRESS);

  const items: StakingInfo[] = await protocol.methods
    .getStakingInfo(account)
    .call();

  const delegations: DeFiStaking[] = items.map((stakingInfo) => {
    const nodeType =
      NODE_TYPE__BY_CONTRACT_ADDRESS[stakingInfo.delegation.toLowerCase()];

    const deposit = Number(stakingInfo.deposit) / 10 ** 18;
    const sklayTotalSupply = Number(stakingInfo.sklayTotalSupply) / 10 ** 18;
    const totalStaking = Number(stakingInfo.totalStaking) / 10 ** 18;

    const delegated = (deposit / sklayTotalSupply) * totalStaking;

    return {
      type: nodeType,
      address: stakingInfo.delegation,
      tokens: [{ ...klaytnChain.currency, address: ZERO_ADDRESS }],
      wallet: null,
      staked: {
        tokenAmounts: {
          [ZERO_ADDRESS]: delegated,
        },
      },
      // TODO:
      rewards: 'unavailable',
      unstake: {
        claimable: 'unavailable',
        pending: {
          tokenAmounts: {
            [ZERO_ADDRESS]: Number(stakingInfo.pending) / 10 ** 18,
          },
        },
      },
    };
  });

  return delegations;
};

type StakingInfo = {
  delegation: string;
  sklay: string;
  store: string;
  deposit: string;
  historyCount: string;
  totalIn: string;
  totalOut: string;
  sTotalIn: string;
  sTotalOut: string;
  pending: string;
  sklayTotalSupply: string;
  totalStaking: string;
  userBalanceKLAY: string;
  userBalanceSKLAY: string;
};
