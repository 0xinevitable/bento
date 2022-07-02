import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { TrackedSection } from '@/components/TrackedSection';
import { systemFontStack } from '@/styles/fonts';

import { onMobile, onTablet } from '../utils/breakpoints';

export const BackgroundSection = () => {
  return (
    <Wrapper id="background">
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
          All dashboard services out there are either:
          <br />
          Associated with specific layer-1 chains,
          {`\n`}
          built by the same team or shared VCs
          <br />
          Or maintained as close-source software.
          {`\n`}
          Both making them move timid outside their ecosystem.
        </Description>
        <Description style={{ marginTop: 20, color: 'white' }}>
          We're building Bento to address this.
          {`\n`}
          Our goal is to make{' '}
          <strong>every user track every asset they own,</strong>
          {`\n`}
          regardless of chains and types.
          {`\n`}
          We’re building <strong>open-source.</strong>
          {`\n`}
          Any developer can add support for their protocol/app freely.
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

const Wrapper = styled(TrackedSection)`
  margin: 0 auto;
  padding-top: 25px;
  padding-bottom: 292px;
  width: 100%;
  max-width: 1728px;

  position: relative;

  display: flex;
  justify-content: center;

  & * {
    transition: all 0.2s ease-in-out;
  }

  ${onTablet} {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const Container = styled.div`
  max-width: 598px;
  width: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 1040px) {
    & > span.badge {
      z-index: 1;
    }
  }
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

  @media screen and (max-width: 1040px) {
    z-index: 1;
  }

  ${onTablet} {
    font-size: 42px;
  }

  ${onMobile} {
    font-size: 38px;
  }
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
  white-space: break-spaces;

  color: rgba(255, 255, 255, 0.66);

  @media screen and (max-width: 1040px) {
    z-index: 1;
  }

  ${onTablet} {
    font-size: 15px;
  }

  ${onMobile} {
    white-space: normal;
  }
`;

const BitcoinIllustContainer = styled.div`
  width: 380px;
  height: 380px;

  position: absolute;
  top: 89px;
  left: ${-380 + 36}px;
  z-index: 0;

  @media screen and (max-width: 1040px) {
    left: -240px;
  }

  ${onTablet} {
    top: 160px;
    left: -180px;
  }

  ${onMobile} {
    top: 260px;
    left: -120px;
  }

  @media screen and (max-width: 400px) {
    width: 280px;
    height: 280px;

    top: 380px;
  }
`;
const EthereumIllustContainer = styled.div`
  width: 380px;
  height: 380px;

  position: absolute;
  top: -101px;
  right: ${-380 + 75}px;
  z-index: 0;

  @media screen and (max-width: 1040px) {
    right: -240px;
  }

  ${onTablet} {
    top: -160px;
    right: -130px;
  }

  @media screen and (max-width: 400px) {
    width: 280px;
    height: 280px;

    right: -120px;
  }
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
