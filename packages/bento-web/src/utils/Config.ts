import { Config as BentoConfig } from '@bento/common';
import getNextConfig from 'next/config';

const { publicRuntimeConfig } = getNextConfig();

const getConfig = () => {
  const { ENVIRONMENT, MAIN_API_BASE_URL } = publicRuntimeConfig as {
    ENVIRONMENT: 'debug' | 'development' | 'production';
    MAIN_API_BASE_URL: string;
  };
  return {
    ENVIRONMENT,
    MAIN_API_BASE_URL,
    ...BentoConfig,
  };
};
export const Config = getConfig();
