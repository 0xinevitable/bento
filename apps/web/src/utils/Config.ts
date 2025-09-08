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
    API_BASE_URL: SERVERLESS_API_BASE_URL || '', // Use SERVERLESS_API_BASE_URL as API_BASE_URL
  };
};
export const Config = getConfig();
