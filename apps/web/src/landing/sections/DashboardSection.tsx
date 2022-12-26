import styled from '@emotion/styled';
import dedent from 'dedent';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';

import {
  AnimatedToolTip,
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/system';
import { withAttrs } from '@/utils/withAttrs';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';

const ASSETS = {
  ILLUST: [
    '/assets/landing/dashboard-illust.png',
    '/assets/landing/dashboard-illust@2x.png',
  ],
};

const CHAINS = [
  { name: 'Ethereum', src: '/assets/icons/ethereum.png' },
  { name: 'BNB', src: '/assets/icons/bnb.png' },
  { name: 'Avalanche', src: '/assets/icons/avalanche.png' },
  { name: 'Polygon', src: '/assets/icons/polygon.png' },
  { name: 'Optimism', src: '/assets/icons/optimism.png' },
  { name: 'Klaytn', src: '/assets/icons/klaytn.png' },
  { name: 'Cosmos Hub', src: '/assets/icons/cosmos-hub.png' },
  { name: 'Osmosis', src: '/assets/icons/osmosis.png' },
  { name: 'Evmos', src: '/assets/icons/evmos.png' },
  { name: 'OpenSea', src: '/assets/icons/opensea.png' },
  { name: 'Solana', src: '/assets/icons/solana.png' },
];

const cardSources = (name: string) => ({
  src: `/assets/landing/dashboard-card-${name}.png`,
  srcSet: dedent`
    /assets/landing/dashboard-card-${name}.png 1x,
    /assets/landing/dashboard-card-${name}@2x.png 2x
  `,
});

export const DashboardSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  const { t } = useTranslation('landing');

  return (
    <Wrapper>
      <Section {...trackedSectionOptions}>
        <Information>
          <SectionBadge>{t('Dashboard for all L1s')}</SectionBadge>
          <SectionTitle>
            {t('View Your ')}
            <br />
            {t('Entire Portfolio')}
          </SectionTitle>
          <Paragraph>
            {t('DASHBOARD_PARA_1')}
            <br />
            {t('DASHBOARD_PARA_2')}
          </Paragraph>

          <ChainLogoList>
            {CHAINS.map((chain) => (
              <AnimatedToolTip key={chain.src} label={chain.name}>
                <ChainLogoContainer>
                  <ChainLogo src={chain.src} alt={chain.name} />
                </ChainLogoContainer>
              </AnimatedToolTip>
            ))}
          </ChainLogoList>
        </Information>

        <IllustWrapper>
          <IllustContainer>
            <Illust
              src={ASSETS.ILLUST[0]}
              srcSet={dedent`
                    ${ASSETS.ILLUST[0]} 1x,
                    ${ASSETS.ILLUST[1]} 2x
                  `}
            />

            <EthereumCardContainer>
              <EthereumCard {...cardSources('ethereum')} />
            </EthereumCardContainer>
            <CloneXCardContainer>
              <CloneXCard {...cardSources('clonex')} />
            </CloneXCardContainer>
            <DaiCardContainer>
              <DaiCard {...cardSources('dai')} />
            </DaiCardContainer>
            <OsmosisCardContainer>
              <OsmosisCard {...cardSources('osmosis')} />
            </OsmosisCardContainer>
            <TetherCardContainer>
              <TetherCard {...cardSources('tether')} />
            </TetherCardContainer>
          </IllustContainer>
        </IllustWrapper>
      </Section>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 32px;
  width: 100%;
  display: flex;
  position: relative;
`;
const Section = styled(TrackedSection)`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  position: relative;
`;
const Information = styled.div`
  display: flex;
  flex-direction: column;
`;

const Paragraph = styled.p`
  margin-top: 24px;
  max-width: 469px;
  width: 100%;

  font-weight: 400;
  font-size: 16px;
  line-height: 145%;

  color: #ffffff;
`;

const ChainLogoList = styled.div`
  margin-top: 52px;
  width: 240.8px;
  height: 81.6px;

  display: flex;
  flex-wrap: wrap;
  column-gap: 4px;
  row-gap: 8px;
  z-index: 3;
`;
const ChainLogoContainer = styled.div`
  width: 36.8px;
  height: 36.8px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
`;
const ChainLogo = withAttrs(
  { width: 36, height: 36 },
  styled(Image)`
    object-fit: cover;
  `,
);

const IllustWrapper = styled.div`
  position: absolute;
  top: -112px;
  right: ${-110 + 43.49}px;

  @media (max-width: 1235px) {
    position: static;
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
      margin: 0 auto;
    }
  }

  @media (max-width: 500px) {
    margin: -40px 0;
  }
`;
const IllustContainer = styled.div`
  position: relative;
  width: 748.51px;
  height: 602.55px;
  display: flex;

  img {
    object-fit: cover;
  }

  @media (max-width: 800px) {
    transform: scale(0.9);
  }

  @media (max-width: 695px) {
    transform: scale(0.85);
  }

  @media (max-width: 500px) {
    transform: scale(0.8);
  }

  @media (max-width: 500px) {
    transform: scale(0.7);
  }
`;

const ILLUST_BLUR_TOP = 120 - 53.47;
const ILLUST_BLUR_LEFT = 120 - 66.8;
const ILLUST_BLUR_RIGHT = 120 - 40.71;
const ILLUST_BLUR_BOTTOM = 120 - 63.08;
const Illust = styled.img`
  width: ${748.51 + ILLUST_BLUR_LEFT + ILLUST_BLUR_RIGHT}px;
  height: ${602.55 + ILLUST_BLUR_TOP + ILLUST_BLUR_BOTTOM}px;

  margin-top: ${-ILLUST_BLUR_TOP}px;
  margin-left: ${-ILLUST_BLUR_LEFT}px;
  margin-right: ${-ILLUST_BLUR_RIGHT}px;
  margin-bottom: ${-ILLUST_BLUR_BOTTOM}px;
`;

const EthereumCardContainer = styled.div`
  width: 315.17px;
  height: 192.86px;

  position: absolute;
  top: 18.49px;
  right: 52.78px;
  transform: rotate(-7deg);
`;
const ETHEREUM_CARD_BLUR_TOP = 20 - 13;
const ETHEREUM_CARD_BLUR_LEFT = 20 - 6.24;
const EthereumCard = styled.img`
  width: ${315.17 + ETHEREUM_CARD_BLUR_LEFT}px;
  height: ${192.86 + ETHEREUM_CARD_BLUR_TOP}px;

  margin-top: ${-ETHEREUM_CARD_BLUR_TOP}px;
  margin-left: ${-ETHEREUM_CARD_BLUR_LEFT}px;
`;

const CloneXCardContainer = styled.div`
  width: 299.35px;
  height: 163.05px;

  position: absolute;
  top: 335.55px;
  left: 435.48px;
  transform: rotate(12deg);
`;
const CLONEX_CARD_BLUR_BOTTOM = 20 - 4.47;
const CLONEX_CARD_BLUR_LEFT = CLONEX_CARD_BLUR_BOTTOM;
const CloneXCard = styled.img`
  width: ${299.35 + CLONEX_CARD_BLUR_LEFT}px;
  height: ${163.05 + CLONEX_CARD_BLUR_BOTTOM}px;

  margin-left: ${-CLONEX_CARD_BLUR_LEFT}px;
  margin-bottom: ${-CLONEX_CARD_BLUR_BOTTOM}px;
`;

const DAI_CARD_BLUR_TOP = 15.48;
const DAI_CARD_BLUR_LEFT = 15.48;
const DAI_CARD_BLUR_BOTTOM = 15.48 - 1.89;
const DaiCardContainer = styled.div`
  width: 209.98px;
  height: 93.76px;

  position: absolute;
  top: 251.11px;
  left: 7.66px;
  transform: rotate(-12.5deg);
`;
const DaiCard = styled.img`
  width: ${209.98 + DAI_CARD_BLUR_LEFT}px;
  height: ${93.76 + DAI_CARD_BLUR_TOP + DAI_CARD_BLUR_BOTTOM}px;

  margin-top: ${-DAI_CARD_BLUR_TOP}px;
  margin-left: ${-DAI_CARD_BLUR_LEFT}px;
  margin-bottom: ${-DAI_CARD_BLUR_BOTTOM}px;
`;

const OsmosisCardContainer = styled.div`
  width: 232.48px;
  height: 149.45px;

  position: absolute;
  top: 67.51px;
  left: 110.73px;
  transform: rotate(4deg);
`;
const OSMOSIS_CARD_BLUR_LEFT = 15.97 - 9.35;
const OSMOSIS_CARD_BLUR_BOTTOM = 15.97 - 4.98;
const OsmosisCard = styled.img`
  width: ${232.48 + OSMOSIS_CARD_BLUR_LEFT}px;
  height: ${149.45 + OSMOSIS_CARD_BLUR_BOTTOM}px;

  margin-left: ${-OSMOSIS_CARD_BLUR_LEFT}px;
  margin-bottom: ${-OSMOSIS_CARD_BLUR_BOTTOM}px;
`;

const TETHER_CARD_BLUR_TOP = 17.01 - 11.06;
const TETHER_CARD_BLUR_LEFT = 17.01 - 5.31;
const TetherCardContainer = styled.div`
  width: 269.82px;
  height: 167.04px;

  position: absolute;
  top: 405.36px;
  left: 90.75px;
  transform: rotate(-14deg);
`;
const TetherCard = styled.img`
  width: ${269.82 + TETHER_CARD_BLUR_LEFT}px;
  height: ${167.04 + TETHER_CARD_BLUR_TOP}px;

  margin-top: ${-TETHER_CARD_BLUR_TOP}px;
  margin-left: ${-TETHER_CARD_BLUR_LEFT}px;
`;
