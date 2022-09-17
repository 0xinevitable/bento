import { Config as BentoConfig } from '@bento/common';
import getNextConfig from 'next/config';

const { publicRuntimeConfig } = getNextConfig();

const getConfig = () => {
  const { ENVIRONMENT } = publicRuntimeConfig as {
    ENVIRONMENT: 'debug' | 'development' | 'production';
  };
  return {
    ENVIRONMENT,
    ...BentoConfig,
  };
};
export const Config = getConfig();
