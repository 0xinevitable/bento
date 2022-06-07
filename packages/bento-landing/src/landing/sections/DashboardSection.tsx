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
        <MockupIllust
          src="/assets/illusts/dashboard-mockup.png"
          srcSet={dedent`
            /assets/illusts/dashboard-mockup.png,
            /assets/illusts/dashboard-mockup@2x.png 2x,
          `}
        />
      </IllustContainer>
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
  margin-top: ${64 + 35}px;
  width: 854px;
  height: 756px;
  position: relative;
`;

const DashboardIllust = styled.img`
  width: 649px;
  height: 577px;

  position: absolute;
  top: -35px;
  right: 0px;
`;
const MockupIllust = styled.img`
  width: 100%;
  height: 100%;
`;
