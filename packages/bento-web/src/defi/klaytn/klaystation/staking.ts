import { ZERO_ADDRESS } from '@bento/core';

import { DeFiStaking, KlaytnDeFiProtocolType } from '@/defi/types/staking';

import { klaytnChain } from '../constants';
import {
  NODE_TYPE__BY_CONTRACT_ADDRESS,
  PROTOCOL_ABI,
  PROTOCOL_ADDRESS,
} from './constants';

const provider = klaytnChain._provider;

export const getDelegations = async (
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
      protocol: KlaytnDeFiProtocolType.KLAYSTATION,
      type: nodeType,
      address: stakingInfo.delegation,
      tokens: [klaytnChain.currency],
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
