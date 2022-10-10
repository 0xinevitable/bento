import createGlobe from 'cobe';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useWindowSize } from '@/hooks/useWindowSize';

import { Colors, systemFontStack } from '@/styles';
import { Analytics } from '@/utils';

export const HeaderSection: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('landing');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { width: screenWidth } = useWindowSize();

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    let phi = 0;
    const globeSize = screenWidth <= 560 ? 280 : 400;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: globeSize * 2,
      height: globeSize * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      scale: 1.25,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      markers: [],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    setTimeout(() => (canvasRef.current!.style.opacity = '1'));

    window.onbeforeunload = () => {
      if (canvasRef.current) {
        canvasRef.current.style.transition = 'opacity 0.2s ease';
        canvasRef.current.style.opacity = '0';
      }
    };

    return () => {
      globe.destroy();
    };
  }, [screenWidth]);

  return (
    <Header>
      <GlobeWrapper>
        <canvas
          ref={canvasRef}
          style={{
            opacity: 0,
            transition: 'opacity 1s ease',
          }}
        />
        <div className="overlay" />
      </GlobeWrapper>

      <Content>
        <Title>{t('Discover Your ⚡Web3 World')}</Title>
        <Description>
          {t('Bento aggregates your identity from the 2nd/3rd web')}
        </Description>
        <Button
          onClick={async () => {
            Analytics.logEvent('click_dashboard_landing_link', {
              medium: 'landing-globe',
            });
            router.push('/home');
          }}
        >
          {t('Start Now')}
        </Button>
      </Content>
    </Header>
  );
};

const Header = styled.div`
  width: 100%;
  height: 494px;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  z-index: 0;
`;
const GlobeWrapper = styled.div`
  width: 100%;
  height: 400px;

  position: absolute;
  top: 94px;
  z-index: 0;

  display: flex;
  justify-content: center;

  & > canvas {
    width: 400px;
    height: 400px;
    border-radius: 50%;
  }

  & > div.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;

    &::after {
      content: '';
      width: 400px;
      height: 400px;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        ${Colors.gray900} 85.94%
      );
    }
  }

  @media (max-width: 560px) {
    height: 280px;

    & > canvas,
    & > div.overlay::after {
      width: 280px;
      height: 280px;
    }
  }
`;

const Content = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  margin: 0 16px;
  font-weight: 900;
  font-size: 64px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.06em;

  /* FIXME: Tailwind */
  &&,
  & * {
    font-family: ${systemFontStack} !important;
  }

  &:lang(ko) {
    font-size: 58px;
  }

  color: ${Colors.gray000};
  text-shadow: 0px 2px 24px ${Colors.black};

  @media (max-width: 900px) {
    font-size: 58px;
  }

  @media (max-width: 768px) {
    &:lang(ko) {
      font-size: 48px;
    }
  }

  @media (max-width: 512px) {
    font-size: 48px;
  }
`;

const Description = styled.p`
  margin: 12px 16px 0;

  font-weight: 600;
  font-size: 20px;
  line-height: 120%;
  text-align: center;
  letter-spacing: -0.02em;

  color: ${Colors.gray200};
  text-shadow: 0px 2px 24px ${Colors.black};

  @media (max-width: 768px) {
    font-weight: 500;
    font-size: 18px;
  }

  @media (max-width: 582px) {
    max-width: 380px;
  }

  /* FIXME: Tailwind */
  &,
  & * {
    font-family: ${systemFontStack} !important;
  }
`;

const Button = styled.button`
  margin-top: 24px;
  width: fit-content;

  display: flex;
  flex-direction: row;
  align-items: flex-start;
  padding: 20px 36px;
  gap: 10px;

  background: ${Colors.brandgradient};
  box-shadow: 0px 8px 12px rgba(0, 0, 0, 0.18);
  border-radius: 12px;

  font-weight: 700;
  font-size: 28px;
  line-height: 100%;
  text-align: center;
  letter-spacing: -0.02em;
  color: ${Colors.gray000};

  /* shadow-default */
  text-shadow: 0px 8px 12px rgba(0, 0, 0, 0.18);

  @media (max-width: 768px) {
    padding: 18px 32px;
    font-size: 24px;
    font-weight: 600;
  }
`;
