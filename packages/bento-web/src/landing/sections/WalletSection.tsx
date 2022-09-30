import { Wallet } from '@bento/common';
import { useTranslation } from 'next-i18next';
import Image from 'next/future/image';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

import {
  AnimatedToolTip,
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/system';

import { WALLETS } from '@/constants/wallets';
import {
  WalletItemList,
  walletCountStyle,
} from '@/dashboard/sections/WalletListSection/WalletList';
import { WalletListItem } from '@/dashboard/sections/WalletListSection/WalletListItem';
import {
  AddWalletButton,
  ButtonContainer,
} from '@/dashboard/sections/WalletListSection/WalletListSection';
import { Colors } from '@/styles';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';
import { onMobile, onTablet } from '../utils/breakpoints';

const MOCKED_WALLET: Wallet = {
  type: 'evm',
  address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  networks: ['ethereum', 'polygon', 'bnb', 'avalanche', 'opensea', 'klaytn'],
};

export const WalletSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  const { t } = useTranslation('landing');
  const { t: tc } = useTranslation('common');

  return (
    <Wrapper>
      <Container {...trackedSectionOptions}>
        <Content>
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
        </Content>

        <CardBorder>
          <Card>
            <span className="title">{t('Wallets')}</span>

            <div style={{ display: 'flex', position: 'relative', height: 348 }}>
              <WalletItemList
                style={{
                  marginTop: 22,
                  padding: 0,
                  position: 'absolute',
                  top: 0,
                  overflow: 'visible',
                }}
              >
                <WalletListItem {...MOCKED_WALLET} />
                <WalletListItem {...MOCKED_WALLET} />
                <WalletListItem {...MOCKED_WALLET} />
                <WalletListItem {...MOCKED_WALLET} />
              </WalletItemList>
              <CardFooter>
                <div />
                <div>
                  <span>
                    {t('Wallets Connected')}&nbsp;&nbsp;
                    <span className="total">24</span>
                  </span>
                </div>
              </CardFooter>
            </div>

            <ButtonContainer>
              <AddWalletButton onClick={() => {}}>
                {t('Add Another')}
              </AddWalletButton>
            </ButtonContainer>
          </Card>
        </CardBorder>
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

  display: flex;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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

const CardBorder = styled.div`
  margin-top: 16px;
  margin-left: 62px;
  max-width: 568px;
  width: 100%;
  height: fit-content;

  padding: 1px;
  background: #787d83;
  background: radial-gradient(
    96.62% 96.62% at 10.25% 1.96%,
    #aaaaaa 0%,
    #282c30 37.71%,
    #787d83 100%
  );
  border-radius: 16px;

  position: relative;

  &,
  * {
    transform-style: preserve-3d;

    transition: all 0.4s linear;
    user-select: none;
    -webkit-user-drag: none;
  }

  &::after {
    content: '';
    height: 58px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
  }
`;
const Card = styled.div`
  padding: 32px 24px 64px;
  background: ${Colors.gray850};
  border-radius: 16px;

  & > span.title {
    font-weight: 700;
    font-size: 32px;
    line-height: 100%;
    text-align: center;
    letter-spacing: -0.6px;
    color: ${Colors.gray400};
  }
`;
const CardFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 86px;

  display: flex;
  flex-direction: column;

  & > div:first-of-type {
    width: 100%;
    height: 64px;

    background: linear-gradient(
      to bottom,
      transparent 22%,
      ${Colors.gray850} 97%
    );
  }

  && > div:last-of-type {
    background-color: ${Colors.gray850};
  }

  ${walletCountStyle}
`;
