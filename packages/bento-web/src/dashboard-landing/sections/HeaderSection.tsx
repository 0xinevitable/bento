import React from 'react';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import {
  TrackedSection,
  TrackedSectionOptions,
} from '@/components/TrackedSection';
import { Analytics } from '@/utils/analytics';

import { systemFontStack } from '../styles/fonts';
import { onMobile, onTablet } from '../utils/breakpoints';

export const HeaderSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  return (
    <Container {...trackedSectionOptions}>
      <Content>
        <Badge>INTRODUCING BENTO</Badge>
        <Title>
          The <span>Open-Source</span>
          <br />
          <TitleGradientWrapper>
            <TitleGradient>
              Web3
              <TitleBlank>&nbsp;</TitleBlank>
            </TitleGradient>
            <TitleGradient>Dashboard</TitleGradient>
          </TitleGradientWrapper>
        </Title>
        <Description>
          Manage and group your wallets,
          <br />
          Track DeFis and NFTs in various L1 chains.
        </Description>

        <ButtonLink
          href="/home"
          onClick={() => Analytics.logEvent('click_app_link', undefined)}
        >
          <Button>Launch App</Button>
        </ButtonLink>
      </Content>

      <IllustContainer>
        <HeaderBlurIllust src="/assets/dashboard-landing/illusts/header-blur.png" />
        <BentoIllust src="/assets/dashboard-landing/illusts/lunchbox.png" />
        <BentoZap src="/assets/dashboard-landing/illusts/bento-zap.png" />
      </IllustContainer>
    </Container>
  );
};

const Container = styled(TrackedSection)`
  margin: 0 auto;
  padding-top: 130px;
  padding-bottom: 100px;

  max-width: 1728px;
  width: 100%;

  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;

  ${onTablet} {
    padding-left: 20px;
    padding-right: 20px;
  }

  @media screen and (max-width: 400px) {
    padding-left: 16px;
    padding-right: 16px;
  }

  ${onMobile} {
    padding-top: 120px;
  }

  @media screen and (max-height: 650px) {
    padding-top: 90px;
  }

  & *:not(button) {
    transition: all 0.2s ease-in-out;
  }
`;

const IllustContainer = styled.div`
  margin-top: -195px;
  width: 925.88px;
  height: 875.52px;
  position: relative;
  z-index: 0;

  transform-origin: top center;

  @media screen and (max-height: 1100px) {
    transform: scale(0.75);
    margin-bottom: ${-875.52 * (1 - 0.75)}px;
  }

  ${onTablet} {
    margin-top: -${195 * 0.65}px;
    transform: scale(0.65);
    margin-bottom: ${-875.52 * (1 - 0.65)}px;
  }

  @media screen and (max-width: 620px) {
    margin-top: -${195 * 0.5}px;
    transform: scale(0.5);
    margin-bottom: ${-875.52 * (1 - 0.5)}px;
  }

  ${onMobile} {
    margin-right: -10%;
  }

  @media screen and (max-width: 480px) {
    margin-top: -${195 * 0.45}px;
    transform: scale(0.45);
    margin-bottom: ${-875.52 * (1 - 0.45)}px;
  }

  @media screen and (max-width: 420px) {
    margin-top: -10px;
    transform: scale(0.38);
    margin-bottom: ${-875.52 * (1 - 0.38)}px;

    @media screen and (max-height: 800px) {
      margin-top: -40px;
      margin-bottom: ${-875.52 * (1 - 0.38)}px;
    }
  }
`;
const HEADER_BLUR_SIZE = 155.6;
const HeaderBlurIllust = styled.img`
  margin: ${-HEADER_BLUR_SIZE}px;
  width: ${1146 + HEADER_BLUR_SIZE * 2}px;
  height: ${602 + HEADER_BLUR_SIZE * 2}px;

  position: absolute;
  top: -164px;
  left: -202px;
`;
const BentoIllust = styled.img`
  width: 752px;
  height: 724.93px;
  transform: rotate(-13deg);

  position: absolute;
  right: 71.9px;
  bottom: 75.29px;
`;

const BENTO_ZAP_BLUR_SIZE = 160;
const BentoZap = styled.img`
  margin: ${-BENTO_ZAP_BLUR_SIZE}px;
  width: ${555.34 + BENTO_ZAP_BLUR_SIZE * 2}px;
  height: ${585.34 + BENTO_ZAP_BLUR_SIZE * 2}px;

  position: absolute;
  left: -47px;
  bottom: 109.18px;
`;

const Content = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

const Title = styled.h1`
  margin: 0;
  margin-top: 12px;

  font-family: ${systemFontStack};
  font-weight: 900;
  font-size: 64px;
  line-height: 103%;
  letter-spacing: 0.01em;
  color: #ffffff;
  text-align: center;

  ${onTablet} {
    font-size: 48px;
  }

  ${onMobile} {
    font-size: 28px;
    line-height: 42px;
  }

  & > span {
    display: inline-block;
  }
`;
const TitleGradientWrapper = styled.span`
  && {
    display: inline-flex;
  }

  ${onMobile} {
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;
    height: fit-content;
  }
`;
const TitleGradient = styled.span`
  width: fit-content;
  background: linear-gradient(180deg, #ffd978 0%, #ff047d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  ${onMobile} {
    font-size: 42px;
  }
`;
const TitleBlank = styled.span`
  && {
    display: unset;

    ${onMobile} {
      display: none;
    }
  }
`;

const Description = styled.p`
  margin: 0;
  margin-top: 12px;

  font-family: ${systemFontStack};
  font-weight: 500;
  font-size: 18px;
  line-height: 120%;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;

  ${onTablet} {
    font-size: 16px;
  }

  ${onMobile} {
    font-size: 14px;
  }
`;

const ButtonLink = styled.a`
  margin-top: 42px;
  width: 100%;
  display: flex;
  justify-content: center;

  ${onTablet} {
    margin-top: 24px;
  }
`;

const Button = styled.button`
  padding: 20px 0;
  width: 100%;
  max-width: 282px;
  position: relative;

  border-radius: 8px;
  border: 1px solid rgba(255, 165, 165, 0.66);
  background: radial-gradient(98% 205% at 0% 0%, #74021a 0%, #c1124f 100%);
  filter: drop-shadow(0px 10px 32px rgba(151, 42, 53, 0.33));

  font-family: ${systemFontStack};
  font-style: normal;
  font-weight: 700;
  font-size: 21.3946px;

  line-height: 100%;
  text-align: center;
  letter-spacing: -0.05em;

  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0px 4px 12px rgba(101, 0, 12, 0.42);

  /* cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='90' height='96' viewport='0 0 100 100' style='fill:black;font-size:48px;'><text y='50%'>⚡</text></svg>")
      16 0,
    pointer; */
  cursor: pointer;

  ${onMobile} {
    font-size: 18px;
    padding: 18px 0;
  }

  &:hover {
    border-color: rgba(255, 165, 165, 0.45);

    /* 85% opacity */
    background: radial-gradient(
      98% 205% at 0% 0%,
      rgba(116, 2, 27, 0.85) 0%,
      rgba(193, 18, 79, 0.85) 100%
    );
  }
`;
