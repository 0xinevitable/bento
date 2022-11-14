import { ZERO_ADDRESS } from '@bento/core';

import {
  LocalizedString,
  ProtocolAccountInfo,
  ProtocolGetAccount,
  ProtocolInfo,
} from '@/_lib/types';

import { klaytnChain } from '../_lib/chain';
import { PROTOCOL_ABI, PROTOCOL_ADDRESS } from './_constants';

const provider = klaytnChain._provider;

const DELEGATOR_BY_CONTRACT_ADDRESS: Record<string, LocalizedString> = {
  '0xe33337cb6fbb68954fe1c3fde2b21f56586632cd': {
    en: 'Hashed-Ozys',
    ko: '해시드-오지스',
  },
  '0xeffa404dac6ba720002974c54d57b20e89b22862': {
    en: 'The Korea Economic Daily',
    ko: '한국경제신문',
  },
  '0x962cdb28e662b026df276e5ee7fdf13a06341d68': {
    en: 'FSN',
    ko: 'FSN',
  },
};

const info: ProtocolInfo = {
  native: false,
  ind: null,
  name: {
    en: 'GC Staking',
    ko: '거버넌스 카운슬 스테이킹',
  },
};
export default info;

export const getAccount: ProtocolGetAccount = async (account) => {
  try {
    const protocol = new provider.klay.Contract(PROTOCOL_ABI, PROTOCOL_ADDRESS);

    const items: StakingInfo[] = await protocol.methods
      .getStakingInfo(account)
      .call();

    const delegations: ProtocolAccountInfo[] = items.map((stakingInfo) => {
      const delegator =
        DELEGATOR_BY_CONTRACT_ADDRESS[stakingInfo.delegation.toLowerCase()];

      const deposit = Number(stakingInfo.deposit) / 10 ** 18;
      const sklayTotalSupply = Number(stakingInfo.sklayTotalSupply) / 10 ** 18;
      const totalStaking = Number(stakingInfo.totalStaking) / 10 ** 18;

      const delegated = (deposit / sklayTotalSupply) * totalStaking;

      return {
        delegator: delegator,
        ind: stakingInfo.delegation,
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
  } catch (err) {
    throw err;
  }
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
