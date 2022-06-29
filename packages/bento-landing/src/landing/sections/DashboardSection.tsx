import dedent from 'dedent';
import styled from 'styled-components';

import { systemFontStack } from '@/styles/fonts';

export const DashboardSection = () => {
  return (
    <Container>
      <Subtitle>Dashboard</Subtitle>
      <Title>
        Track your
        <br />
        Portfolio in Bento
      </Title>
      <IllustContainer>
        <DashboardIllust
          src="/assets/illusts/dashboard.png"
          srcSet={dedent`
            /assets/illusts/dashboard.png,
            /assets/illusts/dashboard@2x.png 2x,
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

const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-weight: 700;
  font-size: 54px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);
`;

const IllustContainer = styled.div`
  margin-top: 39px;
  width: 495.31px;
  height: 495.31px;
  position: relative;
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
  display: flex;
  gap: 12px;
`;
const ChainCard = styled.ul`
  padding: 24px 30px;
  background: #1b1a30;
  border: 1px solid #000000;
  border-radius: 12px;
`;
const ChainCardTitle = styled.h3`
  margin: 0;
  font-family: ${systemFontStack};
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: #ffd7e6;
  text-align: center;
`;

const ChainLogoList = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
`;
const ChainLogo = styled.img`
  width: 84px;
  height: 84px;
  border-radius: 50%;
`;

const CHAIN_LOGOS = {
  EVM: {
    ethereum: '/assets/chains/ethereum.png',
    avalanche: '/assets/chains/avalanche.png',
    bnb: '/assets/chains/bnb.png',
    polygon: '/assets/chains/polygon.png',
    klaytn: '/assets/chains/klaytn.png',
  },
  CosmosSDK: {
    cosmosHub: '/assets/chains/cosmos-hub.png',
    osmosis: '/assets/chains/osmosis.png',
  },
  Others: {
    solana: '/assets/chains/solana.png',
    opensea: '/assets/chains/opensea.png',
  },
};
