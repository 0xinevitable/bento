import { ServiceInfo } from '@/_lib/types';

import { KOKOS_TOKEN_INFO } from './_constants';

const info: ServiceInfo = {
  native: false,
  name: {
    en: 'Kokonut Swap',
    ko: '코코넛 스왑',
  },
  logo: KOKOS_TOKEN_INFO.logo,
  url: 'https://kokonutswap.finance',
  description: {
    en: 'Kokonut Swap is a next-generation AMM DEX protocol for the Klaytn ecosystem, which enables users/protocols to exchange stablecoins with low slippage.',
    ko: '코코넛 스왑은 유저 및 프로토콜들이 스테이블코인을 낮은 슬리피지로 교환할 수 있게 해주는 클레이튼 생태계의 2세대 AMM DEX 프로토콜입니다.',
  },
};
export default info;
