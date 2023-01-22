import { Config as BentoConfig } from '@bento/common';
import getNextConfig from 'next/config';

const { publicRuntimeConfig } = getNextConfig();

const getConfig = () => {
  const { ENVIRONMENT, API_BASE_URL, SERVERLESS_API_BASE_URL } =
    publicRuntimeConfig as {
      ENVIRONMENT: 'debug' | 'development' | 'production';
      API_BASE_URL: string;
      SERVERLESS_API_BASE_URL: string;
    };
  return {
    ENVIRONMENT,
    API_BASE_URL,
    SERVERLESS_API_BASE_URL,
    ...BentoConfig,
  };
};
export const Config = getConfig();
