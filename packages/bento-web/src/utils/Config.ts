import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const Config = publicRuntimeConfig as {
  ENVIRONMENT: 'debug' | 'development' | 'production';
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};
