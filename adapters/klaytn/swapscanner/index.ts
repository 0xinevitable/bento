import { ServiceInfo } from '@/_lib/types';

import { SCNR_TOKEN_INFO } from './_constants';

const info: ServiceInfo = {
  native: false,
  name: {
    en: 'Swapscanner',
    ko: '스왑스캐너',
  },
  logo: SCNR_TOKEN_INFO.logo,
  url: 'https://swapscanner.io',
  description: {
    en: 'Swapscanner is a next-generation DEX Aggregator that enables users to buy tokens at the lowest price in the Klaytn Network.',
    ko: '스왑스캐너는 클레이튼 생태계에서 최저가 토큰 구매를 보장하는 차세대 DEX 애그리게이터입니다.',
  },
};
export default info;
