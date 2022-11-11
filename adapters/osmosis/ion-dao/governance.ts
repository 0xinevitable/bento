import { safePromiseAll } from '@bento/common';
import { OSMOSIS_TOKENS } from '@bento/core';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import { ProtocolGetAccount, ProtocolInfo } from '@/_lib/types';

const ION_DENOM = 'uion';
const ION_TOKEN_INFO = OSMOSIS_TOKENS.find((v) => v.address === ION_DENOM)!;

const STAKING_ADDRESS =
  'osmo1yg8930mj8pk288lmkjex0qz85mj8wgtns5uzwyn2hs25pwdnw42sf745wc';

const info: ProtocolInfo = {
  native: false,
  ind: null,
  name: {
    en: 'Governance',
    ko: '거버넌스',
  },
};
export default info;

export const getAccount: ProtocolGetAccount = async (account: string) => {
  try {
    const cosmwasmClient = await CosmWasmClient.connect(
      // https://discord.com/channels/798583171548840026/877743338760069141/986639531975516240
      'https://rpc-osmosis.blockapsis.com',
    );
    const [{ power: stakedRawBalance }, { claims }] = (await safePromiseAll([
      cosmwasmClient.queryContractSmart(STAKING_ADDRESS, {
        voting_power_at_height: {
          address: account,
        },
      }),
      cosmwasmClient.queryContractSmart(STAKING_ADDRESS, {
        claims: {
          address: account,
        },
      }),
    ])) as [VotingPowerAtHeightResponse, ClaimsResponse];

    const stakedBalance =
      Number(stakedRawBalance) / 10 ** ION_TOKEN_INFO.decimals;
    const [unstakedClaimableAmount, unstakedPendingAmount] = claims.reduce(
      ([claimableAcc, pendingAcc], claim) => {
        const timestamp = Number(claim.release_at.at_time) / 1_000_000;
        const amount = Number(claim.amount) / 10 ** ION_TOKEN_INFO.decimals;
        if (timestamp <= Date.now()) {
          return [claimableAcc + amount, pendingAcc];
        }
        return [claimableAcc, pendingAcc + amount];
      },
      [0, 0],
    );

    return [
      {
        prefix: ION_TOKEN_INFO.symbol,
        ind: STAKING_ADDRESS,
        tokens: [{ ...ION_TOKEN_INFO, ind: ION_TOKEN_INFO.address }],
        wallet: null,
        staked: {
          tokenAmounts: {
            [ION_DENOM]: stakedBalance,
          },
        },
        unstake: {
          claimable: {
            tokenAmounts: {
              [ION_DENOM]: unstakedClaimableAmount,
            },
          },
          pending: {
            tokenAmounts: {
              [ION_DENOM]: unstakedPendingAmount,
            },
          },
        },
        rewards: null,
      },
    ];
  } catch (err) {
    throw err;
  }
};

type VotingPowerAtHeightResponse = {
  power: string;
  height: number;
};
type ClaimsResponse = {
  claims: {
    amount: string;
    release_at: {
      at_time: string;
    };
  }[];
};
