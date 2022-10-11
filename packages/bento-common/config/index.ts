type EnvironmentSecrets = {
  SUPABASE_ANON_KEY: string;
  SUPABASE_URL: string;
  OPENSEA_API_KEYS: string[];
  CMC_PRO_API_KEYS: string[];
};

const HARDCODED_SECRETS = {
  RPC_URL: {
    AVALANCHE_C_MAINNET: 'https://api.avax.network/ext/bc/C/rpc',
    ETHEREUM_MAINNET:
      'https://mainnet.infura.io/v3/fcb656a7b4d14c9f9b0803a5d7475877',
    BNB_MAINNET: 'https://bsc-dataseed1.binance.org',
    POLYGON_MAINNET: 'https://polygon-rpc.com',
    KLAYTN_MAINNET: 'https://public-node-api.klaytnapi.com/v1/cypress',
  },
} as const;

export type Secrets = EnvironmentSecrets & typeof HARDCODED_SECRETS;

export const splitAPIKeys = (value: string | undefined) =>
  value?.split(',') || [];

export const Config: Secrets = {
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  OPENSEA_API_KEYS: splitAPIKeys(process.env.NEXT_PUBLIC_OPENSEA_API_KEYS),
  CMC_PRO_API_KEYS: splitAPIKeys(process.env.NEXT_PUBLIC_CMC_PRO_API_KEYS),
  ...HARDCODED_SECRETS,
};

export const randomOf = (items: string[]) =>
  items[Math.floor(Math.random() * items.length)];
