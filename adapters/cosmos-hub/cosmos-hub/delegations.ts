import { OsmosisChain } from '@bento/core';

import { DeFiStaking } from '@/_lib/types/staking';

const osmosisChain = new OsmosisChain();
const osmosis = osmosisChain.currency;

export default async function (address: string): Promise<DeFiStaking> {
  const [delegations, rewards, osmoPrice] = await Promise.all([
    osmosisChain.getDelegations(address),
    osmosisChain.getRewards(address),
    osmosisChain.getCurrencyPrice(),
  ]);

  return {
    native: true,
    type: 'delegations',
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
}
