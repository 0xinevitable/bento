import { defineChain } from 'viem';

import { FeatureFlags } from '@/utils/feature-flag';

const MitosisMainnet = defineChain({
  id: 124816,
  name: 'Mitosis Mainnet',
  nativeCurrency: {
    name: 'MITO',
    symbol: 'MITO',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'Mitosis Explorer',
      url: 'https://blockscout.mitosis.org',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.mitosis.org'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
});

const MitosisDognet = defineChain({
  id: 124859,
  name: 'Mitosis Dognet',
  nativeCurrency: {
    name: 'MITO',
    symbol: 'MITO',
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: 'Mitosis Dognet Explorer',
      url: 'https://blockscout.dognet.mitosis.org',
    },
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.dognet.mitosis.org'],
    },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
});

export const MitosisChain = FeatureFlags.isMainnetEnabled
  ? MitosisMainnet
  : MitosisDognet;