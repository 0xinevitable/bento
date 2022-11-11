import {
  BentoChainAdapter,
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from './_lib/types';

export type { BentoChainAdapter, BentoProtocolAdapter, BentoServiceAdapter };
export { type CosmosSDKBasedChain } from './_lib/types/cosmos-sdk';

export type BentoSupportedNetwork =
  | 'avalanche'
  | 'bnb'
  | 'cosmos-hub'
  | 'ethereum'
  | 'klaytn'
  | 'osmosis'
  | 'polygon'
  | 'solana';

type Adapters = Record<
  BentoSupportedNetwork,
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
  avalanche: {
    chain: require('./avalanche'),
    services: {},
  },
  bnb: {
    chain: require('./bnb'),
    services: {},
  },
  'cosmos-hub': {
    chain: require('./cosmos-hub'),
    services: {
      'cosmos-hub': {
        info: require('./cosmos-hub'),
        protocols: {
          delegations: require('./cosmos-hub/delegations'),
        },
      },
    },
  },
  ethereum: {
    chain: require('./ethereum'),
    services: {},
  },
  klaytn: {
    chain: require('./klaytn'),
    services: {
      klaystation: {
        info: require('./klaystation'),
        protocols: {
          staking: require('./klaystation/staking'),
        },
      },
      klayswap: {
        info: require('./klayswap'),
        protocols: {
          governance: require('./klayswap/governance'),
          lp: require('./klayswap/lp'),
          single: require('./klayswap/single'),
        },
      },
      kokonutswap: {
        info: require('./kokonutswap'),
        protocols: {
          governance: require('./kokonutswap/governance'),
          lp: require('./kokonutswap/lp'),
        },
      },
      swapscanner: {
        info: require('./swapscanner'),
        protocols: {
          governance: require('./swapscanner/governance'),
        },
      },
    },
  },
  osmosis: {
    chain: require('./osmosis'),
    services: {
      'ion-dao': {
        info: require('./ion-dao'),
        protocols: {
          governance: require('./ion-dao/governance'),
        },
      },
      osmosis: {
        info: require('./osmosis'),
        protocols: {
          delegations: require('./osmosis/delegations'),
          gamm: require('./osmosis/gamm'),
        },
      },
    },
  },
  polygon: {
    chain: require('./polygon'),
    services: {},
  },
  solana: {
    chain: require('./solana'),
    services: {},
  },
};
