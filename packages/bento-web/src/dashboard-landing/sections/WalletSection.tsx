import {
  TrackedSection,
  TrackedSectionOptions,
} from '@bento/client/components';
import React from 'react';
import styled from 'styled-components';

import { onMobile, onTablet } from '../utils/breakpoints';

export const WalletSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  return (
    <Container {...trackedSectionOptions}>
      <Subtitle>Dashboard</Subtitle>
      <Title>
        Manage and Share
        <br />
        Your Wallets
      </Title>
      <WalletIllustWrapper>
        <WalletIllust src="/assets/dashboard-landing/illusts/wallet.png" />
      </WalletIllustWrapper>

      <WalletList>
        {WALLETS.map((walletSrc) => (
          <li key={walletSrc}>
            <WalletIcon src={walletSrc} />
          </li>
        ))}
      </WalletList>
    </Container>
  );
};

const Container = styled(TrackedSection)`
  margin-top: 292px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${onMobile} {
    padding: 0 20px;
  }
`;

const Subtitle = styled.span`
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

  font-weight: 900;
  font-size: 54px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);

  ${onTablet} {
    font-size: 42px;
  }

  ${onMobile} {
    font-size: 38px;
  }
`;

const WalletIllustWrapper = styled.div`
  margin-top: 16px;
  display: flex;

  ${onTablet} {
    margin: -30px 0;
    transform: scale(0.85);
  }

  ${onMobile} {
    margin: -12% 0;
    transform: scale(0.68);
  }
`;
const WalletIllust = styled.img`
  margin-top: ${-50}px;
  margin-right: ${-151.68}px;
  width: ${525.31 + 151.68}px;
  height: ${525.31 + 50}px;
  object-fit: contain;
`;

const WALLETS = [
  '/assets/wallets/metamask.png',
  '/assets/wallets/walletconnect.png',
  '/assets/wallets/keplr.png',
  '/assets/wallets/kaikas.png',
  '/assets/wallets/phantom.png',
];

const WalletList = styled.ul`
  margin: 0;
  margin-top: 52px;
  padding: 0;
  list-style-type: none;

  display: flex;
  justify-content: center;
  gap: 16px;

  @media screen and (max-width: 800px) {
    gap: 12px;
  }

  ${onTablet} {
    gap: 8px;
    margin-top: 24px;
  }

  @media screen and (max-width: 600px) {
    gap: 6px;
  }

  ${onMobile} {
    margin-top: 0;
    gap: 4px;
  }
`;
const WalletIcon = styled.img`
  width: 131px;
  height: 131px;

  @media screen and (max-width: 800px) {
    width: 100px;
    height: 100px;
  }

  @media screen and (max-width: 600px) {
    width: 86px;
    height: 86px;
  }

  ${onMobile} {
    width: 64px;
    height: 64px;
  }

  @media screen and (max-width: 368px) {
    width: 56px;
    height: 56px;
  }
`;
