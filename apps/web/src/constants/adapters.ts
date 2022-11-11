// FIXME: Use types/values from @bento/adapters
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
