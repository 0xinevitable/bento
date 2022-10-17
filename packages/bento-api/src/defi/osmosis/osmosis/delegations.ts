import { OsmosisChain } from '@bento/core';

import {
  DeFiStaking,
  OsmosisDeFiProtocolType,
  OsmosisDeFiType,
} from '@/defi/types/staking';

const osmosisChain = new OsmosisChain();
const osmosis = osmosisChain.currency;

export const getDelegations = async (address: string): Promise<DeFiStaking> => {
  const delegations = await osmosisChain.getDelegations(address);

  return {
    protocol: OsmosisDeFiProtocolType.OSMOSIS,
    type: OsmosisDeFiType.OSMOSIS_GOVERNANCE,
    address: OsmosisDeFiType.OSMOSIS_GOVERNANCE,
    wallet: null,
    tokens: [osmosis],
    staked: {
      tokenAmounts: {
        [osmosis.coinMinimalDenom]: delegations,
      },
    },
    unstake: null,
    rewards: 'unavailable',
  };
};
