import dedent from 'dedent';
import styled from 'styled-components';

import { TrackedSection } from '@/components/TrackedSection';

import { systemFontStack } from '../styles/fonts';
import { onMobile, onTablet } from '../utils/breakpoints';

export const DashboardSection = () => {
  return (
    <Container id="dashboard">
      <Subtitle>Dashboard</Subtitle>
      <Title>
        Track your
        <br />
        Portfolio in Bento
      </Title>
      <IllustContainer>
        <DashboardIllust
          src="/assets/dashboard-landing/illusts/dashboard.png"
          srcSet={dedent`
            /assets/dashboard-landing/illusts/dashboard.png,
            /assets/dashboard-landing/illusts/dashboard@2x.png 2x,
          `}
        />
      </IllustContainer>

      <ChainCardList>
        <ChainCard>
          <ChainCardTitle>EVM Based</ChainCardTitle>
          <ChainLogoList>
            {Object.entries(CHAIN_LOGOS.EVM).map(([name, src]) => (
              <ChainLogo key={name} src={src} />
            ))}
          </ChainLogoList>
        </ChainCard>
        <ChainCard>
          <ChainCardTitle>Cosmos SDK Based</ChainCardTitle>
          <ChainLogoList>
            {Object.entries(CHAIN_LOGOS.CosmosSDK).map(([name, src]) => (
              <ChainLogo key={name} src={src} />
            ))}
          </ChainLogoList>
        </ChainCard>
        <ChainCard>
          <ChainCardTitle>{`Others & Services`}</ChainCardTitle>
          <ChainLogoList>
            {Object.entries(CHAIN_LOGOS.Others).map(([name, src]) => (
              <ChainLogo key={name} src={src} />
            ))}
          </ChainLogoList>
        </ChainCard>
      </ChainCardList>
    </Container>
  );
};

const Container = styled(TrackedSection)`
  display: flex;
  flex-direction: column;
  align-items: center;

  & * {
    transition: all 0.2s ease-in-out;
  }

  ${onMobile} {
    padding: 0 20px;
  }

  @media screen and (max-width: 370px) {
    padding: 0 16px;
  }
`;

const Subtitle = styled.span`
  font-family: ${systemFontStack};
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;

  background: linear-gradient(
    180deg,
    #ddccd3 24.6%,
    #a97e8f 52.47%,
    #bc4e79 73.02%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Title = styled.h2`
  margin: 0;
  margin-top: 12px;

  font-family: ${systemFontStack};
  font-weight: 900;
  font-size: 54px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);

  ${onTablet} {
    font-size: 42px;
  }

  ${onMobile} {
    font-size: 38px;
  }
`;

const IllustContainer = styled.div`
  margin-top: 39px;
  width: 495.31px;
  height: 495.31px;
  position: relative;

  ${onTablet} {
    margin-top: 10px;
    margin-bottom: -5%;
    transform: scale(0.85);
  }

  ${onMobile} {
    margin-top: -50px;
    margin-bottom: -18%;
    transform: scale(0.65);
  }
`;

const BLUR_SIZE = 200 - 34;
const DashboardIllust = styled.img`
  margin-left: ${-BLUR_SIZE}px;
  margin-bottom: ${-BLUR_SIZE}px;
  width: ${495.31 + BLUR_SIZE}px;
  height: ${495.31 + BLUR_SIZE}px;
`;

const ChainCardList = styled.ul`
  margin-top: 32px;
  width: auto;
  display: flex;
  justify-content: center;
  gap: 12px;

  @media screen and (max-width: 900px) {
    flex-direction: column;
    align-items: center;

    & > li {
      width: 100%;
    }
  }

  ${onMobile} {
    width: 100%;
  }
`;
const ChainCard = styled.li`
  padding: 24px 30px;
  background: #1b1a30;
  border: 1px solid #000000;
  border-radius: 12px;

  @media screen and (max-width: 1000px) {
    padding: 20px 28px;
  }

  @media screen and (max-width: 370px) {
    padding: 16px 24px;
  }
`;
const ChainCardTitle = styled.h3`
  margin: 0;
  font-family: ${systemFontStack};
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: #ffd7e6;
  text-align: center;

  @media screen and (max-width: 1000px) {
    font-size: 16px;
    line-height: 120%;
  }
`;

const ChainLogoList = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;

  @media screen and (max-width: 1000px) {
    margin-top: 16px;
    gap: 6px;
  }

  @media screen and (max-width: 428px) {
    gap: 4px;
  }
`;
const ChainLogo = styled.img`
  width: 84px;
  height: 84px;
  border-radius: 50%;

  @media screen and (max-width: 1100px) {
    width: 72px;
    height: 72px;
  }

  @media screen and (max-width: 1000px) {
    width: 64px;
    height: 64px;
  }

  @media screen and (max-width: 428px) {
    width: 56px;
    height: 56px;
  }

  @media screen and (max-width: 360px) {
    width: 48px;
    height: 48px;
  }
`;

const CHAIN_LOGOS = {
  EVM: {
    ethereum: '/assets/icons/ethereum.png',
    avalanche: '/assets/icons/avalanche.png',
    bnb: '/assets/icons/bnb.png',
    polygon: '/assets/icons/polygon.png',
    klaytn: '/assets/icons/klaytn.png',
  },
  CosmosSDK: {
    cosmosHub: '/assets/icons/cosmos-hub.png',
    osmosis: '/assets/icons/osmosis.png',
  },
  Others: {
    solana: '/assets/icons/solana.png',
    opensea: '/assets/icons/opensea.png',
  },
};
