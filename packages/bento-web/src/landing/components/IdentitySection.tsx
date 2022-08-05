import dedent from 'dedent';
import styled, { css } from 'styled-components';

import { Badge } from '@/components/Badge';

const ASSETS = {
  DIAGRAM: [
    '/assets/landing/identity-diagram.png',
    '/assets/landing/identity-diagram@2x.png',
  ],
  BACKGROUND: [
    '/assets/landing/identity-background.png',
    '/assets/landing/identity-background@2x.png',
  ],
} as const;

export const IdentitySection: React.FC = () => {
  return (
    <Section>
      <Information>
        <Badge>Blockchain for Cross-Chain Identity</Badge>
        <Title>
          Define your <br />
          identity
        </Title>
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Paragraph>
      </Information>

      <IllustWrapper>
        <IllustContainer>
          <Illust
            src={ASSETS.DIAGRAM[0]}
            srcSet={dedent`
                ${ASSETS.DIAGRAM[0]} 1x,
                ${ASSETS.DIAGRAM[1]} 2x
              `}
          />
        </IllustContainer>
      </IllustWrapper>
    </Section>
  );
};

const Section = styled.section`
  margin: 170px auto 0;
  max-width: 1180px;
  width: 100%;
  height: 814px;
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
  max-width: 348px;
  width: 100%;

  font-weight: 400;
  font-size: 16px;
  line-height: 145%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;

const IllustWrapper = styled.div`
  position: absolute;
  top: 67px;
  right: ${-110 + 81.13}px;
`;
const IllustContainer = styled.div`
  position: relative;
  width: 804.92px;
  height: 513px;
  z-index: 0;

  filter: saturate(1.2);
`;

const Illust = styled.img`
  width: 861.03px;
  height: 749px;
  object-fit: contain;
`;
