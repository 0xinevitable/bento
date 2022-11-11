import {
  BentoChainAdapter,
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from './_lib/types';

export { type BentoChainAdapter };
export { type CosmosSDKBasedChain } from './_lib/types/cosmos-sdk';

type NetworkName = 'osmosis';

type Adapters = Record<
  NetworkName,
  {
    chain: BentoChainAdapter;
    services: Record<
      string,
      {
        info: BentoServiceAdapter;
        protocols: Record<string, BentoProtocolAdapter>;
      }
    >;
  }
>;

export const adapters: Adapters = {
  osmosis: {
    chain: require('./osmosis'),
    services: {
      osmosis: {
        info: require('./osmosis/osmosis'),
        protocols: {
          governance: require('./osmosis/governance'),
          gamm: require('./osmosis/gamm'),
        },
      },
      'ion-dao': {
        info: require('./osmosis/ion-dao'),
        protocols: {
          governance: require('./osmosis/ion-dao-governance'),
        },
      },
    },
  },
};
