import Image from 'next/image';
import styled from 'styled-components';

import { Portal } from '@/components/Portal';
import {
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/TrackedSection';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';

const ASSETS = {
  DIAGRAM: '/assets/landing/identity-diagram.png',
  BACKGROUND: '/assets/landing/identity-background.png',
} as const;

export const IdentitySection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  return (
    <Wrapper>
      <Section {...trackedSectionOptions}>
        <Information>
          <SectionBadge>Blockchain for Cross-Chain Identity</SectionBadge>
          <SectionTitle>
            Define your <br />
            identity
          </SectionTitle>
          <Paragraph>
            After receiving proof(<code>"signatures"</code>) that
            cryptographically proves the signer's ownership of each wallet,
            Bento register new "users" and save wallets under that identity.
            <br />
            <br />
            So we now have an abstraction layer of user identity, and it'll soon
            be decentralized as an application-specific blockchain, based on the{' '}
            <a href="https://github.com/cosmos/cosmos-sdk" target="_blank">
              Cosmos SDK
            </a>{' '}
            and{' '}
            <a href="https://tendermint.com" target="_blank">
              Tendermint consensus
            </a>
            ; User identifiers as <code>Accounts</code>, wallet validation
            requests as <code>Messages</code>, validation logic as{' '}
            <code>Modules</code>.
            <br />
            <br />
            Third-party apps will be able to consume, relay, and commit data to
            the identity chain, with all cross-chain identities and actions.
          </Paragraph>
        </Information>

        <Portal id="landing-background">
          <BackgroundContainer>
            <BackgroundContent>
              <BackgroundMargin>
                <BackgroundImageContainer>
                  <Background src={ASSETS.BACKGROUND} />
                </BackgroundImageContainer>
              </BackgroundMargin>
            </BackgroundContent>
          </BackgroundContainer>
        </Portal>

        <IllustWrapper>
          <IllustContainer>
            <IllustImageContainer>
              <Illust src={ASSETS.DIAGRAM} />
            </IllustImageContainer>
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
const Section = styled(TrackedSection)`
  margin: 170px auto 0;
  max-width: 1180px;
  width: 100%;
  height: 814px;
  position: relative;

  @media (max-width: 1235px) {
    margin-top: 32px;
    height: fit-content;
  }
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
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 1235px) {
    max-width: 80%;
  }

  a {
    text-decoration: underline;
    color: white;
  }

  code {
    font-family: monospace;
    font-style: italic;
  }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: -1;
  bottom: 0;
  right: 0;

  * {
    user-select: none;
  }
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
const BackgroundImageContainer = styled.div`
  width: 1240px;
  height: 687.76px;
`;
const Background = styled(Image).attrs({
  width: 1240,
  height: 687.76,
})``;
const IllustWrapper = styled.div`
  position: absolute;
  top: 67px;
  right: ${-110 + 81.13}px;

  @media (max-width: 1235px) {
    position: static;
    display: flex;
    justify-content: center;
    align-items: center;

    & > div {
      margin: 0 auto;
      height: fit-content;
      width: fit-content;
    }

    & > div > img {
      width: 100%;
      max-width: 700px;
      height: auto;
    }
  }

  @media (max-width: 600px) {
    & > div > img {
      width: 450px;
    }
  }

  @media (max-width: 400px) {
    margin-left: 10%;
  }
`;
const IllustContainer = styled.div`
  position: relative;
  width: 804.92px;
  height: 513px;
  z-index: 0;

  filter: saturate(1.2);
`;

const IllustImageContainer = styled.div`
  width: 861.03px;
  height: 749px;
`;
const Illust = styled(Image).attrs({
  width: 861.03,
  height: 749,
  objectFit: 'contain',
})``;
