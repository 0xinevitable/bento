import { ProtocolGetAccount, ProtocolInfo } from '@/_lib/types';

import { CosmosHubChain } from '..';

const cosmosHubChain = new CosmosHubChain();
const atom = cosmosHubChain.currency;

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
    const [delegations] = await Promise.all([
      cosmosHubChain.getDelegations(address),
      // cosmosHubChain.getRewards(address),
      // cosmosHubChain.getCurrencyPrice(),
    ]);

    return [
      {
        native: true,
        ind: null,
        wallet: null,
        tokens: [{ ...atom, address: atom.coinMinimalDenom }],
        staked: {
          tokenAmounts: {
            [atom.coinMinimalDenom]: delegations,
          },
          // value: delegations * atomPrice,
        },
        unstake: 'unavailable',
        rewards: 'unavailable',
        // rewards: {
        //   tokenAmounts: {
        //     [atom.coinMinimalDenom]: rewards,
        //   },
        //   value: rewards * atomPrice,
        // },
      },
    ];
  } catch (err) {
    throw err;
  }
};
