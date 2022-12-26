import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React from 'react';

import {
  AnimatedToolTip,
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/system';

import { WALLETS } from '@/constants/wallets';
import { float } from '@/styles';

import { SectionBadge } from '../components/SectionBadge';
import { SectionTitle } from '../components/SectionTitle';
import { onMobile, onTablet } from '../utils/breakpoints';

const WALLET_ICON_LIST = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const CARD_WALLET_ITEM = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
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
          <Title>
            {t('Manage and Share ')}
            <br />
            {t('Your Wallets')}
          </Title>

          <WalletList
            variants={WALLET_ICON_LIST}
            initial="hidden"
            whileInView="show"
          >
            {Object.entries(WALLETS).map(([alt, src]) => (
              <motion.li key={src} variants={CARD_WALLET_ITEM}>
                <AnimatedToolTip placement="bottom" label={tc(alt)}>
                  <WalletIcon alt={tc(alt)} src={src} />
                </AnimatedToolTip>
              </motion.li>
            ))}
          </WalletList>

          <WalletIllustWrapper {...float(16, false, 2)}>
            <WalletIllust
              alt=""
              width={526}
              height={526}
              src="/assets/landing/wallet.png"
            />
          </WalletIllustWrapper>
        </Content>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 32px;
  width: 100%;
  display: flex;
`;
const Container = styled(TrackedSection)`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  position: relative;

  display: flex;

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
`;

const Title = styled(SectionTitle)`
  text-align: center;
`;

const WalletList = styled(motion.ul)`
  margin: 32px 0 0;
  padding: 0;
  list-style-type: none;

  display: flex;
  gap: 8px;

  @media (max-width: 900px) {
    justify-content: center;
  }

  @media (max-width: 600px) {
    gap: 6px;
  }

  ${onMobile} {
    gap: 4px;
  }
`;
const WalletIcon = styled.img`
  width: 128px;
  height: 128px;

  @media (max-width: 800px) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 600px) {
    width: 86px;
    height: 86px;
  }

  ${onMobile} {
    width: 64px;
    height: 64px;
  }

  @media (max-width: 368px) {
    width: 56px;
    height: 56px;
  }
`;

const WalletIllustWrapper = styled(motion.div)`
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
