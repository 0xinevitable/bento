import React from 'react';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { systemFontStack } from '@/styles/fonts';

export const HeaderSection = () => {
  return (
    <Container id="header">
      <Content>
        <Badge>INTRODUCING BENTO</Badge>
        <Title>
          The Open-Source
          <br />
          <TitleGradient>Web3 Dashboard</TitleGradient>
        </Title>
        <Description>
          Manage and group your wallets,
          <br />
          Track DeFis and NFTs in various L1 chains.
        </Description>

        <ButtonLink href="https://app.bento.finance">
          <Button>Launch App</Button>
        </ButtonLink>
      </Content>

      <IllustContainer>
        <HeaderBlurIllust src="/assets/illusts/header-blur.png" />
        <BentoIllust src="/assets/illusts/lunchbox.png" />
        <BentoZap src="/assets/illusts/bento-zap.png" />
      </IllustContainer>
    </Container>
  );
};

const Container = styled.section`
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
`;

const IllustContainer = styled.div`
  margin-top: -195px;
  width: 925.88px;
  height: 875.52px;
  position: relative;
  z-index: 0;
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

const BENTO_ZAP_BLUR_SIZE = 132.228;
const BentoZap = styled.img`
  margin: ${-BENTO_ZAP_BLUR_SIZE}px;
  width: ${369.51 + BENTO_ZAP_BLUR_SIZE * 2}px;
  height: ${525.03 + BENTO_ZAP_BLUR_SIZE * 2}px;

  position: absolute;
  left: 0;
  bottom: 124.49px;
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
`;
const TitleGradient = styled.span`
  width: fit-content;
  background: linear-gradient(180deg, #ffd978 0%, #ff047d 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
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
`;

const ButtonLink = styled.a`
  margin-top: 42px;
`;

const Button = styled.button`
  padding: 20px 80px;
  cursor: pointer;

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
`;
