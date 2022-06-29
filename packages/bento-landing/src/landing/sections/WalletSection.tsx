import React from 'react';
import styled from 'styled-components';

import { systemFontStack } from '@/styles/fonts';

export const WalletSection: React.FC = () => {
  return (
    <Container id="header">
      <Subtitle>Dashboard</Subtitle>
      <Title>
        Manage and Share
        <br />
        Your Wallets
      </Title>
      <WalletIllustWrapper>
        <WalletIllust src="/assets/illusts/wallet.png" />
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

const Container = styled.section`
  margin-top: 292px;
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

const WalletIllustWrapper = styled.div`
  margin-top: 16px;
  display: flex;
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
`;
const WalletIcon = styled.img`
  width: 131px;
  height: 131px;
`;
