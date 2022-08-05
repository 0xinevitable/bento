import dedent from 'dedent';
import Link from 'next/link';
import styled from 'styled-components';

import { AnimatedTooltip } from '@/components/AnimatedToolTip';
import { Badge } from '@/components/Badge';

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

export const DashboardSection: React.FC = () => {
  return (
    <Wrapper>
      <Section>
        <Information>
          <Badge>Dashboard for all L1s</Badge>
          <Title>
            View Your <br />
            Entire Portfolio
          </Title>
          <Paragraph>
            Bento’s goal to make every user track every asset they own,
            regardless of chains and types. And since it’s open-source, any
            developer or team can add support for their protocol/app.
          </Paragraph>
          <Link href="/dashboard" passHref>
            <LearnMore>
              <span>Learn More</span>
              <LearnMoreChevron />
            </LearnMore>
          </Link>

          <ChainLogoList>
            {CHAINS.map((chain) => (
              <AnimatedTooltip key={chain.src} label={chain.name}>
                <ChainLogo src={chain.src} alt={chain.name} />
              </AnimatedTooltip>
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
  padding-top: 135.26px;
  width: 100%;
  display: flex;
  position: relative;

  &:before {
    content: '';
    width: 100%;
    height: 420px;

    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    background-image: linear-gradient(to bottom, black, rgba(255, 255, 255, 0));
  }
`;
const Section = styled.section`
  margin: 0 auto;
  max-width: 1180px;
  width: 100%;
  position: relative;
`;
const Information = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2`
  margin-top: 27px;

  font-weight: 900;
  font-size: 52px;
  line-height: 103%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;
const Paragraph = styled.p`
  margin-top: 24px;
  max-width: 469px;
  width: 100%;

  font-weight: 400;
  font-size: 16px;
  line-height: 145%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;
const LearnMore = styled.a`
  margin-top: 24px;

  display: flex;
  align-items: center;

  span {
    margin-right: 4px;

    font-weight: 700;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0.01em;
    color: #ffffff;
  }
`;

const LearnMoreChevron: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.3332 5L7.1582 6.175L10.9749 10L7.1582 13.825L8.3332 15L13.3332 10L8.3332 5Z"
      fill="white"
    />
  </svg>
);

const ChainLogoList = styled.div`
  margin-top: 52px;
  width: 240.8px;
  height: 81.6px;

  display: flex;
  flex-wrap: wrap;
  column-gap: 4px;
  row-gap: 8px;
`;
const ChainLogo = styled.img`
  width: 36.8px;
  height: 36.8px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
`;

const IllustWrapper = styled.div`
  position: absolute;
  top: -112px;
  right: ${-110 + 43.49}px;
`;
const IllustContainer = styled.div`
  position: relative;
  width: 748.51px;
  height: 602.55px;
  display: flex;

  img {
    object-fit: cover;
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
