import { Config as BentoConfig } from '@bento/common';
import getNextConfig from 'next/config';

const { publicRuntimeConfig } = getNextConfig();

const getConfig = () => {
  const { ENVIRONMENT, SERVERLESS_API_BASE_URL } = publicRuntimeConfig as {
    ENVIRONMENT: 'debug' | 'development' | 'production';
    SERVERLESS_API_BASE_URL: string;
  };
  return {
    ENVIRONMENT,
    SERVERLESS_API_BASE_URL,
    ...BentoConfig,
  };
};
export const Config = getConfig();
