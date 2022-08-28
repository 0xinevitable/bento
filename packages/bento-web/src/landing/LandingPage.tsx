import Image from 'next/image';
import { useEffect } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Button';
import { NavigationBar } from '@/components/NavigationBar';
import { systemFontStack } from '@/dashboard-landing/styles/fonts';
import { Analytics } from '@/utils/analytics';

import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { IdentitySection } from './sections/IdentitySection';
import { RoadmapSection } from './sections/RoadmapSection';
import { StatusQuoSection } from './sections/StatusQuoSection';

const LandingPage: React.FC = () => {
  useEffect(() => {
    Analytics.logEvent('view_landing', undefined);
  }, []);

  return (
    <Container>
      <NavigationBar />

      <BannerWrapper>
        <Banner>
          <BannerContent>
            <BannerTitle>
              HEY YOU!
              <br />
              WE LAUNCHED PROFILES.
            </BannerTitle>

            <SoWhatButton>So what?</SoWhatButton>
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

      <HeaderSection id="header" event="view_landing_section" />
      <DashboardSection id="dashboard" event="view_landing_section" />
      <StatusQuoSection id="status-quo" event="view_landing_section" />
      <IdentitySection id="identity" event="view_landing_section" />
      {/* <RoadmapSection id="roadmap" event="view_landing_section" /> */}
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  width: 100vw;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  section * {
    font-family: 'Raleway', ${systemFontStack};

    &:not(h1, h1 span) {
      transition: all 0.2s ease-in-out;
    }
  }
`;

const BannerWrapper = styled.div`
  padding: 0 16px;
  padding-top: ${82 + 234}px;
  background-color: #0f0a10;
  background: linear-gradient(to right, #090307, #0f0a10);
  position: relative;
  z-index: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    width: 100%;
    height: 500px;
    background: linear-gradient(180deg, black 30%, rgba(0, 0, 0, 0));
  }
`;
const Banner = styled.div`
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

  /* &:after {
    content: '';
    position: absolute;
    left: 1px;
    right: 1px;
    bottom: 0px;
    z-index: 2;
    width: calc(100% -2px);
    height: 200px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    border-radius: 24px;
  } */
`;
const BannerContent = styled.div`
  position: absolute;
  top: 75px;
  left: 36px;
  right: 36px;
  bottom: 36px;

  display: flex;
  flex-direction: column;
  z-index: 3;
`;
const BannerTitle = styled.h2`
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 900;
  font-size: 32px;
  line-height: 120%;
  /* or 38px */

  color: #ffffff;
  text-shadow: 0px 4px 12px #000000;
`;
const SoWhatButton = styled(Button)`
  margin-top: 20px;
  width: 260px;
  height: 56px;
`;

const BannerImageContainer = styled.div`
  position: absolute;
  right: 47.38px;
  bottom: 0;
  z-index: 3;

  width: 491.62px;
  height: 496px;
  filter: saturate(120%);
`;
const BannerImage = styled(Image).attrs({
  src: '/assets/profile/profile-nudge.png',
  width: 491.62 * 1.5,
  height: 496 * 1.5,
  quality: 100,
})``;
const DefineYourselfStickerContainer = styled.div`
  width: 360.45px;
  height: 39.84px;

  position: absolute;
  left: 79.04px;
  top: -21.46px;
  z-index: 4;

  transform: rotate(12.5deg);
  filter: drop-shadow(0px 3.79416px 3.79416px rgba(0, 0, 0, 0.25));
`;
const DefineYourselfSticker = styled(Image).attrs({
  src: '/assets/profile/sticker-define-yourself.png',
  width: 380,
  height: 42,
})``;

const TapeContainer = styled.div`
  width: 870px;
  height: 370px;

  position: absolute;
  bottom: 0;
  right: 0;
  z-index: 2;
  filter: saturate(140%);
`;
const Tape = styled(Image).attrs({
  src: '/assets/profile/profile-nudge-tape.png',
  width: 870,
  height: 370,
})``;
