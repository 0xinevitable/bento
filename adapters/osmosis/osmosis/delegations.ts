import { ProtocolGetAccount, ProtocolInfo } from '@/_lib/types';

import { OsmosisChain } from '..';

const osmosisChain = new OsmosisChain();
const osmo = osmosisChain.currency;

const info: ProtocolInfo = {
  native: true,
  ind: null,
  name: {
    en: 'Governance Staking',
    ko: '거버넌스 스테이킹',
  },
};
export default info;

export const getAccount: ProtocolGetAccount = async (address: string) => {
  try {
    const [delegations, rewards, osmoPrice] = await Promise.all([
      osmosisChain.getDelegations(address),
      osmosisChain.getRewards(address),
      osmosisChain.getCurrencyPrice(),
    ]);

    return [
      {
        native: true,
        ind: null,
        wallet: null,
        tokens: [{ ...osmo, address: osmo.coinMinimalDenom }],
        staked: {
          tokenAmounts: {
            [osmo.coinMinimalDenom]: delegations,
          },
          value: delegations * osmoPrice,
        },
        unstake: 'unavailable',
        rewards: {
          tokenAmounts: {
            [osmo.coinMinimalDenom]: rewards,
          },
          value: rewards * osmoPrice,
        },
      },
    ];
  } catch (err) {
    throw err;
  }
};
