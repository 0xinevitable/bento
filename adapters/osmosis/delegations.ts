import { OsmosisChain } from '@bento/core';

import {
  DeFiStaking,
  OsmosisDeFiProtocolType,
  OsmosisDeFiType,
} from '../_lib/types/staking';

const osmosisChain = new OsmosisChain();
const osmosis = osmosisChain.currency;

export const getDelegations = async (address: string): Promise<DeFiStaking> => {
  const [delegations, rewards, osmoPrice] = await Promise.all([
    osmosisChain.getDelegations(address),
    osmosisChain.getRewards(address),
    osmosisChain.getCurrencyPrice(),
  ]);

  return {
    protocol: OsmosisDeFiProtocolType.OSMOSIS,
    type: OsmosisDeFiType.OSMOSIS_GOVERNANCE,
    address: null,
    wallet: null,
    tokens: [{ ...osmosis, address: osmosis.coinMinimalDenom }],
    staked: {
      tokenAmounts: {
        [osmosis.coinMinimalDenom]: delegations,
      },
      value: delegations * osmoPrice,
    },
    unstake: 'unavailable',
    rewards: {
      tokenAmounts: {
        [osmosis.coinMinimalDenom]: rewards,
      },
      value: rewards * osmoPrice,
    },
  };
};
