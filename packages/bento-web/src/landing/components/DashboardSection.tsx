import styled from 'styled-components';

import { Badge } from '@/components/Badge';

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
    </Section>
  );
};

const Section = styled.section`
  margin: 135.26px auto 0;
  max-width: 1180px;
  width: 100%;
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
