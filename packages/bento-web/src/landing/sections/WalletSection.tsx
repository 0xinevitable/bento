import { useTranslation } from 'next-i18next';
import Image from 'next/future/image';
import React from 'react';
import styled from 'styled-components';

import {
  AnimatedToolTip,
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/system';

import { WALLETS } from '@/constants/wallets';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';
import { onMobile, onTablet } from '../utils/breakpoints';

export const WalletSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  const { t } = useTranslation('landing');
  const { t: tc } = useTranslation('common');

  return (
    <Wrapper>
      <Container {...trackedSectionOptions}>
        <SectionBadge>{t('Connect All Wallets')}</SectionBadge>
        <SectionTitle>
          {t('Manage and Share ')}
          <br />
          {t('Your Wallets')}
        </SectionTitle>

        <WalletList>
          {Object.entries(WALLETS).map(([alt, src]) => (
            <li key={src}>
              <AnimatedToolTip placement="bottom" label={tc(alt)}>
                <WalletIcon alt={tc(alt)} src={src} />
              </AnimatedToolTip>
            </li>
          ))}
        </WalletList>

        <WalletIllustWrapper>
          <WalletIllust
            alt=""
            width={526}
            height={526}
            src="/assets/dashboard-landing/illusts/wallet.png"
          />
        </WalletIllustWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 130px 32px 0;
  width: 100%;
  display: flex;

  @media (max-width: 1235px) {
    padding-top: 64px;
  }
`;
const Container = styled(TrackedSection)`
  margin: 0 auto;
  max-width: 1180px;
  width: 100%;
  position: relative;
`;

const WalletList = styled.ul`
  margin: 24px 0 0;
  padding: 0;
  list-style-type: none;

  display: flex;
  gap: 8px;

  @media screen and (max-width: 600px) {
    gap: 6px;
  }

  ${onMobile} {
    gap: 4px;
  }
`;
const WalletIcon = styled.img`
  width: 128px;
  height: 128px;

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

const WalletIllustWrapper = styled.div`
  margin-top: -108px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 526px;
  height: 526px;
  pointer-events: none;

  ${onTablet} {
    margin: -84px -32px 0;
    width: ${526 * 0.85}px;
    height: ${526 * 0.85}px;

    & > img {
      transform: scale(0.85);
    }
  }

  ${onMobile} {
    margin: -48px -32px 0;

    width: ${526 * 0.65}px;
    height: ${526 * 0.65}px;

    & > img {
      transform: scale(0.65);
    }
  }
`;
const WALLET_TOP_BLUR_SIZE = 50;
const WALLET_RIGHT_BLUR_SIZE = 152.68;
const WalletIllust = styled(Image)`
  margin-top: ${-WALLET_TOP_BLUR_SIZE}px;
  margin-right: ${-WALLET_RIGHT_BLUR_SIZE}px;
  width: ${526 + WALLET_RIGHT_BLUR_SIZE}px;
  height: ${526 + WALLET_TOP_BLUR_SIZE}px;
  object-fit: contain;
  user-select: none;
  filter: saturate(120%);
`;
