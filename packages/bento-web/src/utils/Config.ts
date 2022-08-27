import { Config as BentoConfig } from '@bento/common';
import getNextConfig from 'next/config';

const { publicRuntimeConfig } = getNextConfig();

const getConfig = () => {
  const { ENVIRONMENT, ...config } = publicRuntimeConfig as {
    ENVIRONMENT: 'debug' | 'development' | 'production';
    [key: string]: string;
  };
  return {
    ENVIRONMENT,
    SUPABASE_URL: BentoConfig.STORAGE.SUPABASE_URL[ENVIRONMENT],
    SUPABASE_ANON_KEY: BentoConfig.STORAGE.SUPABASE_ANON_KEY[ENVIRONMENT],
    SLACK_NEW_PROFILE_WEBHOOK:
      BentoConfig.STORAGE.SLACK_NEW_PROFILE_WEBHOOK[ENVIRONMENT],
    ...config,
  };
};
export const Config = getConfig();
