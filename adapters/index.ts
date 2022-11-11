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

export const BentoDeFiSupportedNetworks: BentoSupportedNetwork[] = [
  'cosmos-hub',
  'klaytn',
  'osmosis',
];

type Adapters = Record<
  BentoSupportedNetwork,
  {
    chain: Promise<BentoChainAdapter>;
    services: Record<
      string,
      {
        info: Promise<BentoServiceAdapter>;
        protocols: Record<string, Promise<BentoProtocolAdapter>>;
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
        info: require('./cosmos-hub/cosmos-hub'),
        protocols: {
          delegations: require('./cosmos-hub/cosmos-hub/delegations'),
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
        info: require('./klaytn/klaystation'),
        protocols: {
          staking: require('./klaytn/klaystation/staking'),
        },
      },
      klayswap: {
        info: require('./klaytn/klayswap'),
        protocols: {
          governance: require('./klaytn/klayswap/governance'),
          lp: require('./klaytn/klayswap/lp'),
          single: require('./klaytn/klayswap/single'),
        },
      },
      kokonutswap: {
        info: require('./klaytn/kokonutswap'),
        protocols: {
          governance: require('./klaytn/kokonutswap/governance'),
          lp: require('./klaytn/kokonutswap/lp'),
        },
      },
      swapscanner: {
        info: require('./klaytn/swapscanner'),
        protocols: {
          governance: require('./klaytn/swapscanner/governance'),
        },
      },
    },
  },
  osmosis: {
    chain: require('./osmosis'),
    services: {
      'ion-dao': {
        info: require('./osmosis/ion-dao'),
        protocols: {
          governance: require('./osmosis/ion-dao/governance'),
        },
      },
      osmosis: {
        info: require('./osmosis/osmosis'),
        protocols: {
          delegations: require('./osmosis/osmosis/delegations'),
          gamm: require('./osmosis/osmosis/gamm'),
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
