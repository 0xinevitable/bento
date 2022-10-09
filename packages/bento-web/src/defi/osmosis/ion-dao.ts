import { safePromiseAll } from '@bento/common';
import { OSMOSIS_MAINNET_ASSETLIST, TokenInput } from '@bento/core';
import { CosmWasmClient } from '@cosmjs/cosmwasm-stargate';

import { DeFiStaking, OsmosisDeFiType } from '../types/staking';

const ION_DENOM = 'ion';
const ION_ASSET = OSMOSIS_MAINNET_ASSETLIST.assets.find(
  (v) => v.base === `u${ION_DENOM}`,
)!;
const ION_TOKEN_INFO: TokenInput = {
  symbol: ION_ASSET.symbol,
  name: ION_ASSET.name,
  address: ION_DENOM,
  decimals: ION_ASSET.denom_units.find((v) => v.denom === ION_DENOM)?.exponent!,
  coinGeckoId: ION_ASSET.coingecko_id!,
  logo: ION_ASSET.logo_URIs.png,
};

const STAKING_ADDRESS =
  'osmo1yg8930mj8pk288lmkjex0qz85mj8wgtns5uzwyn2hs25pwdnw42sf745wc';

export const IONDAO = {
  getGovernanceStake: async (bech32address: string): Promise<DeFiStaking> => {
    const cosmwasmClient = await CosmWasmClient.connect(
      // https://discord.com/channels/798583171548840026/877743338760069141/986639531975516240
      'https://rpc-osmosis.blockapsis.com',
    );
    const [{ power: stakedRawBalance }, { claims }] = (await safePromiseAll([
      cosmwasmClient.queryContractSmart(STAKING_ADDRESS, {
        voting_power_at_height: {
          address: bech32address,
        },
      }),
      cosmwasmClient.queryContractSmart(STAKING_ADDRESS, {
        claims: {
          address: bech32address,
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

    return {
      type: OsmosisDeFiType.ION_GOVERNANCE,
      address: STAKING_ADDRESS,
      tokens: [ION_TOKEN_INFO],
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
    };
  },
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
