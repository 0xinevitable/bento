import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Image from 'next/image';

import {
  Button,
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/system';
import { withAttrs } from '@/utils/withAttrs';

import { Colors } from '@/styles';

type Props = TrackedSectionOptions & {
  onClickBanner: () => void;
};

export const ProfileBanner: React.FC<Props> = ({ onClickBanner, ...props }) => {
  return (
    <BannerWrapper {...props}>
      <Banner
        initial={{ transform: `translate3d(0, -300px, 0)`, opacity: 0 }}
        animate={{ transform: `translate3d(0, 0px, 0)`, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.3 }}
      >
        <BannerContent>
          <BannerTitle>
            HEY YOU!
            <br />
            WE LAUNCHED PROFILES.
          </BannerTitle>

          <SoWhatButtonContainer>
            <SoWhatButton onClick={onClickBanner}>So what?</SoWhatButton>
            <CTABadge>See what the fuss is about</CTABadge>
          </SoWhatButtonContainer>
        </BannerContent>

        <DefineYourselfStickerContainer>
          <DefineYourselfSticker />
        </DefineYourselfStickerContainer>

        <TapeContainer>
          <Tape />
        </TapeContainer>

        <BannerImageContainer>
          <BannerImage />
        </BannerImageContainer>
      </Banner>
    </BannerWrapper>
  );
};

const BannerWrapper = styled(TrackedSection)`
  padding: 0 16px;
  /* padding-top: ${82 + 234}px; */
  padding-top: 234px;
  position: relative;
  z-index: 1;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    width: 100%;
    height: 500px;
    background: linear-gradient(
      180deg,
      ${Colors.gray900} 30%,
      rgba(0, 0, 0, 0)
    );
  }

  @media (max-width: 580px) {
    padding-top: ${82 + 146}px;
    margin-bottom: -48px;
  }
`;
const Banner = styled(motion.div)`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  height: 262px;

  border-radius: 16px;
  position: relative;
  z-index: 0;

  background: linear-gradient(180deg, #1b1c1e 0%, #000000 100%),
    linear-gradient(180deg, #f86f5b 0%, rgba(217, 217, 217, 0) 100%);
  border: 1px solid #3d3d3d;
  border-radius: 24px;

  @media (max-width: 950px) {
    &:after {
      content: '';
      position: absolute;
      left: 1px;
      right: 1px;
      bottom: 0px;
      z-index: 3;
      width: calc(100% -2px);
      height: 200px;
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      border-radius: 24px;
    }
  }

  @media (max-width: 400px) {
    &:after {
      height: 280px;
    }
  }
`;
const BannerContent = styled.div`
  position: absolute;
  top: 75px;
  left: 36px;
  right: 36px;
  bottom: 36px;

  display: flex;
  flex-direction: column;
  z-index: 4;

  @media (max-width: 580px) {
    top: unset;
    left: 22px;
    right: 22px;
    bottom: 22px;
  }
`;
const BannerTitle = styled.h2`
  font-weight: 900;
  font-size: 32px;
  line-height: 120%;

  color: #ffffff;
  text-shadow: 0px 4px 12px #000000;

  @media (max-width: 580px) {
    font-size: 24px;
  }
`;

const SoWhatButtonContainer = styled.div`
  margin-top: 20px;
  width: 260px;
  height: 56px;
  position: relative;

  @media (max-width: 580px) {
    &,
    & > button {
      width: 100%;
    }
  }
`;
const SoWhatButton = styled(Button)`
  width: 260px;
  height: 56px;
`;

// FIXME: Duplicatded declares
const CTABadge = styled.span`
  position: absolute;
  top: -12px;
  right: -57px;

  width: fit-content;
  padding: 6px 12px;
  background: rgba(51, 9, 17, 0.88);
  border: 1px solid #ff214a;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.44);
  border-radius: 36px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 600;
  font-size: 14px;
  line-height: 83%;

  text-align: center;
  letter-spacing: -0.5px;

  color: #ff214a;

  @media (max-width: 580px) {
    right: -10px;
  }
`;

const BannerImageContainer = styled.div`
  position: absolute;
  right: 47.38px;
  bottom: 0;
  z-index: 3;

  width: 491.62px;
  height: 496px;
  filter: saturate(120%);

  @media (max-width: 950px) {
    right: 0;
  }

  @media (max-width: 800px) {
    right: -30px;
  }

  @media (max-width: 580px) {
    width: 301px;
    height: 303.68px;
    right: -15px;
    bottom: 104px;
  }
`;
const BannerImage = withAttrs(
  {
    alt: 'Bento Profiles',
    src: '/assets/profile/profile-nudge.png',
    width: 491.62,
    height: 496,
    quality: 100,
  },
  styled(Image)``,
);

const DefineYourselfStickerContainer = styled.div`
  width: 360.45px;
  height: 39.84px;

  position: absolute;
  left: 44px;
  top: 13px;
  z-index: 4;

  transform: rotate(12.5deg);
  filter: drop-shadow(0px 3.79416px 3.79416px rgba(0, 0, 0, 0.25));

  @media (max-width: 800px) {
    top: -140px;
  }

  @media (max-width: 580px) {
    top: 48px;
    width: 265.35px;
    height: 29.33px;
  }

  @media (max-width: 400px) {
    width: 180.84px;
    height: 19.99px;

    top: ${-72.68 - 20}px;
  }
`;
const DefineYourselfSticker = withAttrs(
  {
    alt: 'Define Yourself',
    src: '/assets/profile/sticker-define-yourself.png',
    width: 380,
    height: 42,
  },
  styled(Image)``,
);

const TapeContainer = styled.div`
  width: 870px;
  height: 370px;

  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  filter: saturate(140%);

  @media (max-width: 950px) {
    display: none;
  }
`;
const Tape = withAttrs(
  {
    alt: '',
    src: '/assets/profile/profile-nudge-tape.png',
    width: 870,
    height: 370,
  },
  styled(Image)``,
);
