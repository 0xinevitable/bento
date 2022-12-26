import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';

import bitcoinIllust from '@/assets/illusts/bitcoin.png';
import ethereumIllust from '@/assets/illusts/ethereum.png';
import {
  Badge,
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/system';

import { float } from '@/styles';

import { onMobile, onTablet } from '../utils/breakpoints';

export const BackgroundSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  const { t } = useTranslation('landing');

  return (
    <Wrapper {...trackedSectionOptions}>
      <Container>
        <Badge>{t('BACKGROUND')}</Badge>
        <Title style={{ marginTop: 26 }}>
          {t('Dashboards That are Made Right.')}
        </Title>
        <Description style={{ marginTop: 24 }}>
          <Trans t={t} i18nKey="BACKGROUND_DESC" components={{ br: <br /> }} />
        </Description>

        <BitcoinIllustContainer {...float(20, true, 2)}>
          <Illust alt="" src={bitcoinIllust} sizes="512px" placeholder="blur" />
          <IllustShadow style={{ left: 30, bottom: 29 }} />
        </BitcoinIllustContainer>
        <EthereumIllustContainer {...float(16, false, 2)}>
          <Illust
            alt=""
            src={ethereumIllust}
            sizes="512px"
            placeholder="blur"
          />
          <IllustShadow style={{ top: 69, left: 62 }} />
        </EthereumIllustContainer>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled(TrackedSection)`
  margin: 0 auto;
  width: 100%;
  max-width: 1728px;

  position: relative;

  display: flex;
  justify-content: center;

  & * {
    transition: all 0.2s ease-in-out;
  }

  ${onTablet} {
    padding-left: 20px;
    padding-right: 20px;
  }
`;

const Container = styled.div`
  max-width: 598px;
  width: 100%;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media (max-width: 1040px) {
    & > span.badge {
      z-index: 1;
    }
  }
`;

const Title = styled.h2`
  margin: 0;

  font-weight: 900;
  font-size: 48px;
  line-height: 103%;

  text-align: center;

  color: rgba(255, 255, 255, 0.85);

  z-index: 1;

  ${onTablet} {
    font-size: 42px;
  }

  ${onMobile} {
    font-size: 38px;
  }
`;

const Description = styled.p`
  margin: 0;
  width: 100%;
  max-width: 600px;

  font-weight: 400;
  font-size: 16px;
  line-height: 120%;

  text-align: center;

  white-space: break-spaces;
  color: rgba(255, 255, 255, 0.66);

  z-index: 1;

  ${onTablet} {
    font-size: 15px;
  }

  ${onMobile} {
    white-space: normal;
  }
`;

const BitcoinIllustContainer = styled(motion.div)`
  width: 380px;
  height: 380px;

  position: absolute;
  bottom: -192px;
  left: ${-380 + 75}px;
  z-index: 0;

  @media (max-width: 1240px) {
    left: -240px;
  }

  ${onTablet} {
    left: -130px;
  }

  ${onMobile} {
    left: -120px;
  }

  @media (max-width: 400px) {
    width: 280px;
    height: 280px;
  }
`;
const EthereumIllustContainer = styled(motion.div)`
  width: 380px;
  height: 380px;

  position: absolute;
  top: -101px;
  right: ${-380 + 75}px;
  z-index: 0;

  @media (max-width: 1240px) {
    right: -240px;
  }

  ${onTablet} {
    top: -160px;
    right: -130px;
  }

  @media (max-width: 400px) {
    width: 280px;
    height: 280px;

    right: -120px;
  }
`;
const Illust = styled(Image)`
  width: 100%;
  height: 100%;
  z-index: 1;
  filter: saturate(120%);
`;
const IllustShadow = styled.div`
  width: 160px;
  height: 160px;
  position: absolute;

  border-radius: 50%;
  background-color: #ff214a;
  filter: blur(90px);
  z-index: -1;
`;
