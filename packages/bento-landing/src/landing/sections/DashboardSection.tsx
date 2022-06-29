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
