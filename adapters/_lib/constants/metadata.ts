// import { KSP_TOKEN_INFO } from 'klaytn/klayswap/constants';
// import { KOKOS_TOKEN_INFO } from 'klaytn/kokonutswap/constants';
// import { SCNR_TOKEN_INFO } from 'klaytn/swapscanner/constants';

// import { KlaySwap } from '../klayswap';
// import { KokonutSwap } from '../kokonutswap';
// import { Swapscanner } from '../swapscanner';

export type Metadata = {
  // TODO: Move translations to name
  name: string;
  logo: string;
  description: {
    en: string;
    ko?: string;
  };
};

// export const KLAYTN_DEFI_METADATA: Record<KlaytnDeFiProtocolType, Metadata> = {
//   [KlaytnDeFiProtocolType.KLAYSTATION]: {
//     name: 'KLAYSTATION',
//     logo: '/assets/icons/services/klaytn/klaystation.svg',
//     description: {
//       en: 'KLAYSTATION is a staking tool that allows users to delegate KLAY to GCs(Validators) and get rewards.',
//       ko: '클레이스테이션은 GC 노드(밸리데이터)들에게 KLAY를 위임하고 보상을 수령할 수 있도록 하는 스테이킹 툴입니다.',
//     },
//   },
//   [KlaytnDeFiProtocolType.KLAYSWAP]: {
//     name: 'KLAYswap',
//     logo: KSP_TOKEN_INFO.logo!,
//     description: {
//       en: 'KLAYswap is an AMM-based Instant Swap Protocol.',
//       ko: '클레이스왑은 클레이튼 생태계에서 가장 커다란 DEX(AMM)입니다.',
//     },
//   },
//   [KlaytnDeFiProtocolType.KOKONUTSWAP]: {
//     name: 'Kokonut Swap',
//     logo: KOKOS_TOKEN_INFO.logo!,
//     description: {
//       en: 'Kokonut Swap is a next-generation AMM DEX protocol for the Klaytn ecosystem, which enables users/protocols to exchange stablecoins with low slippage.',
//       ko: '코코넛 스왑은 유저 및 프로토콜들이 스테이블코인을 낮은 슬리피지로 교환할 수 있게 해주는 클레이튼 생태계의 2세대 AMM DEX 프로토콜입니다.',
//     },
//   },
//   [KlaytnDeFiProtocolType.SWAPSCANNER]: {
//     name: 'Swapscanner',
//     logo: SCNR_TOKEN_INFO.logo!,
//     description: {
//       en: 'Swapscanner is a next-generation DEX Aggregator that enables users to buy tokens at the lowest price in the Klaytn Network.',
//       ko: '스왑스캐너는 클레이튼 생태계에서 최저가 토큰 구매를 보장하는 차세대 DEX 애그리게이터입니다.',
//     },
//   },
// };
