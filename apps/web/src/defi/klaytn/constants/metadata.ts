import {
  DeFiProtocolType,
  KlaytnDeFiProtocolType,
  OsmosisDeFiProtocolType,
} from '@/defi/types/staking';

export type Metadata = {
  // TODO: Move translations to name
  name: string;
  logo: string;
  description: {
    en: string;
    ko?: string;
  };
};

export const KLAYTN_DEFI_METADATA: Record<DeFiProtocolType, Metadata> = {
  [OsmosisDeFiProtocolType.ION]: {
    name: 'ION DAO',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/ion.png',
    description: {
      en: 'ION is the secondary native token on the Osmosis chain. The community are collectively discussing potential use-cases to be developed.',
      ko: 'ION은 오스모시스의 두번째 네이티브 토큰입니다. ION DAO 커뮤니티에서는 그 잠재적 사용 사례를 공동으로 논의하고 있습니다.',
    },
  },
  [OsmosisDeFiProtocolType.OSMOSIS]: {
    name: 'Osmosis',
    logo: 'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',
    description: {
      en: 'Osmosis is the largest interchain DEX in the Cosmos Ecosystem.',
      ko: '오스모시스는 코스모스 생태계 최초, 최대의 인터체인 DEX입니다.',
    },
  },

  [KlaytnDeFiProtocolType.KLAYSTATION]: {
    name: 'KLAYSTATION',
    logo: '/assets/icons/services/klaytn/klaystation.svg',
    description: {
      en: 'KLAYSTATION is a staking tool that allows users to delegate KLAY to GCs(Validators) and get rewards.',
      ko: '클레이스테이션은 GC 노드(밸리데이터)들에게 KLAY를 위임하고 보상을 수령할 수 있도록 하는 스테이킹 툴입니다.',
    },
  },
  [KlaytnDeFiProtocolType.KLAYSWAP]: {
    name: 'KLAYswap',
    logo: '/assets/icons/klaytn/0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654.png',
    description: {
      en: 'KLAYswap is an AMM-based Instant Swap Protocol.',
      ko: '클레이스왑은 클레이튼 생태계에서 가장 커다란 DEX(AMM)입니다.',
    },
  },
  [KlaytnDeFiProtocolType.KOKONUTSWAP]: {
    name: 'Kokonut Swap',
    logo: '/assets/icons/klaytn/0xb15183d0d4d5e86ba702ce9bb7b633376e7db29f.png',
    description: {
      en: 'Kokonut Swap is a next-generation AMM DEX protocol for the Klaytn ecosystem, which enables users/protocols to exchange stablecoins with low slippage.',
      ko: '코코넛 스왑은 유저 및 프로토콜들이 스테이블코인을 낮은 슬리피지로 교환할 수 있게 해주는 클레이튼 생태계의 2세대 AMM DEX 프로토콜입니다.',
    },
  },
  [KlaytnDeFiProtocolType.SWAPSCANNER]: {
    name: 'Swapscanner',
    logo: 'https://api.swapscanner.io/api/tokens/0x8888888888885b073f3c81258c27e83db228d5f3/icon',
    description: {
      en: 'Swapscanner is a next-generation DEX Aggregator that enables users to buy tokens at the lowest price in the Klaytn Network.',
      ko: '스왑스캐너는 클레이튼 생태계에서 최저가 토큰 구매를 보장하는 차세대 DEX 애그리게이터입니다.',
    },
  },
};
