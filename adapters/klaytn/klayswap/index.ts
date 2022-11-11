import { ServiceInfo } from '@/_lib/types';

import { KSP_TOKEN_INFO } from './_constants';

const info: ServiceInfo = {
  native: false,
  name: {
    en: 'KLAYswap',
    ko: '클레이스왑',
  },
  logo: KSP_TOKEN_INFO.logo,
  url: 'https://klayswap.com',
  description: {
    en: 'KLAYswap is an AMM-based Instant Swap Protocol.',
    ko: '클레이스왑은 클레이튼 생태계에서 가장 커다란 DEX(AMM)입니다.',
  },
};
export default info;
