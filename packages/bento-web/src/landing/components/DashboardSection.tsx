import dedent from 'dedent';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';

const ASSETS = {
  ILLUST: [
    '/assets/landing/dashboard-illust.png',
    '/assets/landing/dashboard-illust@2x.png',
  ],
};

export const DashboardSection: React.FC = () => {
  return (
    <Section>
      <Information>
        <Badge>Dashboard for all L1s</Badge>
        <Title>
          View Your <br />
          Entire Portfolio
        </Title>
        <Paragraph>
          Bento’s goal to make every user track every asset they own, regardless
          of chains and types. And since it’s open-source, any developer or team
          can add support for their protocol/app.
        </Paragraph>
        <LearnMore>
          <span>Learn More</span>
          <LearnMoreChevron />
        </LearnMore>
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
        </IllustContainer>
      </IllustWrapper>
    </Section>
  );
};

const Section = styled.section`
  margin: 135.26px auto 0;
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

const IllustWrapper = styled.div`
  position: absolute;
  top: -112px;
  right: ${-110 - 43.49}px;
`;
const IllustContainer = styled.div`
  position: relative;
  width: 748.51px;
  height: 602.55px;
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
