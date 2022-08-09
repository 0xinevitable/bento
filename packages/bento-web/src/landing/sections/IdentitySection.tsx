import dedent from 'dedent';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { Portal } from '@/components/Portal';

import { SectionTitle } from '../components/SectionTitle';

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
    <Wrapper>
      <Section>
        <Information>
          <Badge>Blockchain for Cross-Chain Identity</Badge>
          <SectionTitle>
            Define your <br />
            identity
          </SectionTitle>
          <Paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Paragraph>
        </Information>

        <Portal id="landing-background">
          <BackgroundContainer>
            <BackgroundContent>
              <BackgroundMargin>
                <Background
                  src={ASSETS.BACKGROUND[0]}
                  srcSet={dedent`
                    ${ASSETS.BACKGROUND[0]} 1x,
                    ${ASSETS.BACKGROUND[1]} 2x
                  `}
                />
              </BackgroundMargin>
            </BackgroundContent>
          </BackgroundContainer>
        </Portal>

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
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 0 32px;
`;
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

const BackgroundContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  bottom: 0;
  right: 0;
`;
const BackgroundContent = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 1180px;
  height: 100%;

  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`;
const BackgroundMargin = styled.div`
  margin-right: -232px;
  margin-bottom: -88px;
`;
const Background = styled.img`
  width: 1240px;
  height: 687.76px;
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
