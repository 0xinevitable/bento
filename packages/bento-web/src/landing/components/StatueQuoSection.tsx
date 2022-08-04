import styled from 'styled-components';

import { Badge } from '@/components/Badge';

export const StatueQuoSection: React.FC = () => {
  return (
    <Section>
      <Information>
        <Badge>The Status Quo</Badge>
        <Title>
          Users are <br />
          NOT Wallets
        </Title>
        <Paragraph>
          Exactly. Users are entirely different from wallets, <br />
          a more extensive concept by itself. <br />
          But current web3 products treat them the same. <br />
          In the cross-chain universe, user activities and assets no longer
          remain in one address or chain.
        </Paragraph>
      </Information>
    </Section>
  );
};

const Section = styled.section`
  margin: 170px auto 0;
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
