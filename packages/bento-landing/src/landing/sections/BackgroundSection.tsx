import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { systemFontStack } from '@/styles/fonts';

export const BackgroundSection = () => {
  return (
    <Wrapper id="header">
      <Container>
        <Badge>BACKGROUND</Badge>
        <Title style={{ marginTop: 26 }}>
          Before Bento,
          <br />
          proper dashboards
          <br />
          were not available.
        </Title>
        <Description style={{ marginTop: 24 }}>
          Most apps have a connection with specific Layer-1 chains.
          <br />
          These chains were built by the same team or share the same VCs.
          <br />
          So only a few provided information for multiple chains and multiple
          apps.
          <br />
          Full integration was impossible for centralized reasons.
        </Description>
        <Description style={{ marginTop: 20, color: 'white' }}>
          We're building Bento to address this.
          <br />
          Our goal is to make{' '}
          <strong>every user track every asset they own,</strong>
          <br />
          regardless of chains and types.
          <br />
          Eventually, this means that we’ll open-source the adaptors
          <br />
          so that any developer can add support for their protocol/app freely.
        </Description>

        <BitcoinIllustContainer>
          <Illust src="/assets/illusts/bitcoin.png" />
          <IllustShadow style={{ left: 30, bottom: 29 }} />
        </BitcoinIllustContainer>
        <EthereumIllustContainer>
          <Illust src="/assets/illusts/ethereum.png" />
          <IllustShadow style={{ top: 69, left: 62 }} />
        </EthereumIllustContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  margin: 0 auto;
  padding-top: 25px;
  padding-bottom: 292px;
  width: 100%;
  max-width: 1728px;

  position: relative;

  display: flex;
  justify-content: center;
`;

const Container = styled.div`
  max-width: 598px;
  width: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;

  font-family: ${systemFontStack};
  font-weight: 900;
  font-size: 48px;
  line-height: 103%;

  text-align: center;
  letter-spacing: 0.01em;

  color: rgba(255, 255, 255, 0.85);
`;

const Description = styled.p`
  margin: 0;
  width: 100%;
  max-width: 600px;

  font-family: ${systemFontStack};
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;

  text-align: center;
  letter-spacing: 0.01em;

  color: rgba(255, 255, 255, 0.66);
`;

const BitcoinIllustContainer = styled.div`
  width: 380px;
  height: 380px;

  position: absolute;
  top: 89px;
  left: ${-380 + 36}px;
  z-index: 0;
`;
const EthereumIllustContainer = styled.div`
  width: 380px;
  height: 380px;

  position: absolute;
  top: -101px;
  right: ${-380 + 75}px;
  z-index: 0;
`;
const Illust = styled.img`
  width: 100%;
  height: 100%;
  z-index: 1;
`;
const IllustShadow = styled.div`
  width: 160px;
  height: 160px;
  position: absolute;

  border-radius: 50%;
  background-color: #ff214a;
  filter: blur(90px);
  z-index: -1;
`;
