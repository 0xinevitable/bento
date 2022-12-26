import styled from '@emotion/styled';
import Image from 'next/image';

import { TrackedSection, TrackedSectionOptions } from '@/components/system';
import { withAttrs } from '@/utils/withAttrs';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';

const ASSETS = {
  DIAGRAM: '/assets/landing/identity-diagram.png',
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

        <IllustWrapper>
          <IllustContainer>
            <IllustImageContainer>
              <Illust alt="" src={ASSETS.DIAGRAM} />
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
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  height: 814px;
  position: relative;

  @media (max-width: 1235px) {
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
const Illust = withAttrs(
  { width: 861.03, height: 749 },
  styled(Image)`
    object-fit: contain;
  `,
);
