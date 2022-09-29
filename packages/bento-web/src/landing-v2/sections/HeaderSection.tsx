import createGlobe from 'cobe';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';

import { useWindowSize } from '@/hooks/useWindowSize';

import { Colors } from '@/styles';
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

    return () => {
      globe.destroy();
    };
  }, [screenWidth]);

  return (
    <Header>
      <GlobeWrapper>
        <canvas ref={canvasRef} />
        <div className="overlay" />
      </GlobeWrapper>

      <Content>
        <Title>{t('Show who you are.')}</Title>
        <Description>
          {t('Bento aggregates your identity ')}
          <br />
          {t('from the 2nd/3rd web')}
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
  height: 550px;
  background: ${Colors.gray900};

  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;

  @media screen and (max-width: 768px) {
    margin-bottom: -32px;
  }

  @media screen and (max-width: 560px) {
    margin-bottom: -100px;
  }
`;
const GlobeWrapper = styled.div`
  width: 100%;
  height: 400px;

  position: absolute;
  top: 100px;
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

  @media screen and (max-width: 560px) {
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
  top: 185px;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 72px;
  line-height: 120%;
  text-align: center;
  letter-spacing: -0.02em;

  color: ${Colors.gray000};
  text-shadow: 0px 2px 24px ${Colors.black};

  @media screen and (max-width: 768px) {
    font-size: 54px;
  }

  @media screen and (max-width: 560px) {
    margin-bottom: 16px;
    max-width: 65vw;
    line-height: 90%;
  }

  @media screen and (max-width: 425px) {
    max-width: 90vw;
  }
`;

const Description = styled.p`
  margin-top: 4px;

  font-weight: 600;
  font-size: 28px;
  line-height: 120%;
  text-align: center;
  letter-spacing: -0.02em;

  color: ${Colors.gray200};
  text-shadow: 0px 2px 24px ${Colors.black};

  @media screen and (max-width: 768px) {
    font-weight: 500;
    font-size: 24px;
  }

  @media screen and (max-width: 560px) {
    max-width: 90vw;
  }
`;

const Button = styled.button`
  margin-top: 20px;
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

  @media screen and (max-width: 768px) {
    padding: 18px 32px;
    font-size: 24px;
    font-weight: 600;
  }
`;
