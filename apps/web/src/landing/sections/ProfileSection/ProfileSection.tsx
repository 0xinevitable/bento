import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import { useRef } from 'react';

import { TrackedSection, TrackedSectionOptions } from '@/components/system';
import { useInViewport } from '@/hooks/useInViewport';
import { useWindowSize } from '@/hooks/useWindowSize';

import { AnimationCard } from './cards/AnimationCard';
import { DisplayNFTsCard } from './cards/DisplayNFTsCard';
import { LinkInBioCard } from './cards/LinkInBioCard';
import { ProfileSummaryCard } from './cards/ProfileSummaryCard';
import { ShowCaseCryptoCard } from './cards/ShowCaseCryptoCard';

export const ProfileSection: React.FC<TrackedSectionOptions> = ({
  ...trackedSectionOptions
}) => {
  const { i18n } = useTranslation('common');
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  const sectionRef = useRef<HTMLElement>(null);
  const isRendered = useInViewport(sectionRef);

  const { width: screenWidth } = useWindowSize();
  const isCollapsed = screenWidth <= 1110;

  return (
    <Wrapper>
      <Section ref={sectionRef} {...trackedSectionOptions}>
        {!isRendered ? (
          <Placeholder />
        ) : (
          <>
            {currentLanguage === 'en' && <TitleTypographyEN />}
            {currentLanguage === 'ko' && <TitleTypographyKO />}
            {!isCollapsed ? (
              <Column>
                <Row>
                  <ShowCaseCryptoCard />
                  <ProfileSummaryCard />
                  <AnimationCard />
                </Row>
                <Row>
                  <LinkInBioCard />
                  <DisplayNFTsCard />
                </Row>
              </Column>
            ) : (
              <Column>
                <Row>
                  <ShowCaseCryptoCard />
                  <ProfileSummaryCard />
                </Row>
                <Row style={{ height: 'fit-content' }}>
                  <DisplayNFTsCard />
                  <AnimationCard />
                </Row>
                <Row>
                  <LinkInBioCard />
                </Row>
              </Column>
            )}
          </>
        )}
      </Section>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 0 32px;
  width: 100%;
  display: flex;
  position: relative;

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;
const Section = styled(TrackedSection)`
  margin: 0 auto;
  max-width: 1200px;
  width: 100%;
  position: relative;
`;
const Placeholder = styled.div`
  width: 100%;
  height: 800px;
`;

const titleTypographyStyles = css`
  margin-bottom: 20px;

  @media (max-width: 700px) {
    margin-top: -20px;
    margin-bottom: 36px;
    transform: scale(0.6);
    transform-origin: bottom left;
  }

  @media (max-width: 440px) {
    transform: scale(0.45);
  }
`;
const _TitleTypographyEN: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="627"
    height="102"
    viewBox="0 0 627 102"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M81.06 35.9C81.06 42.1533 79.6133 47.8467 76.72 52.98C73.8267 58.02 69.5333 62.0333 63.84 65.02C58.24 68.0067 51.4267 69.5 43.4 69.5H31.08V101H1.04308e-07V1.88H43.4C55.5333 1.88 64.82 4.96 71.26 11.12C77.7933 17.28 81.06 25.54 81.06 35.9ZM39.9 45C46.34 45 49.56 41.9667 49.56 35.9C49.56 29.8333 46.34 26.8 39.9 26.8H31.08V45H39.9ZM137.958 101L119.338 65.44H119.198V101H88.118V1.88H134.318C142.345 1.88 149.205 3.32666 154.898 6.21999C160.591 9.02 164.838 12.8933 167.638 17.84C170.531 22.6933 171.978 28.2 171.978 34.36C171.978 40.9867 170.111 46.8667 166.378 52C162.738 57.1333 157.465 60.82 150.558 63.06L172.118 101H137.958ZM119.198 44.72H131.518C134.505 44.72 136.745 44.0667 138.238 42.76C139.731 41.36 140.478 39.2133 140.478 36.32C140.478 33.7067 139.685 31.6533 138.098 30.16C136.605 28.6667 134.411 27.92 131.518 27.92H119.198V44.72ZM227.407 101.98C218.074 101.98 209.487 99.7867 201.647 95.4C193.9 91.0133 187.74 84.9467 183.167 77.2C178.594 69.4533 176.307 60.7267 176.307 51.02C176.307 41.3133 178.594 32.5867 183.167 24.84C187.74 17.0933 193.9 11.0733 201.647 6.77999C209.487 2.39333 218.074 0.199996 227.407 0.199996C236.74 0.199996 245.28 2.39333 253.027 6.77999C260.774 11.0733 266.887 17.0933 271.367 24.84C275.94 32.5867 278.227 41.3133 278.227 51.02C278.227 60.7267 275.94 69.4533 271.367 77.2C266.887 84.9467 260.727 91.0133 252.887 95.4C245.14 99.7867 236.647 101.98 227.407 101.98ZM227.407 73C233.567 73 238.327 71.04 241.687 67.12C245.047 63.1067 246.727 57.74 246.727 51.02C246.727 44.2067 245.047 38.84 241.687 34.92C238.327 30.9067 233.567 28.9 227.407 28.9C221.154 28.9 216.347 30.9067 212.987 34.92C209.627 38.84 207.947 44.2067 207.947 51.02C207.947 57.74 209.627 63.1067 212.987 67.12C216.347 71.04 221.154 73 227.407 73ZM356.639 1.88V26.52H317.719V40.24H345.719V63.62H317.719V101H286.639V1.88H356.639ZM395.446 1.88V101H364.366V1.88H395.446ZM437.764 77.48H467.724V101H406.684V1.88H437.764V77.48ZM505.784 26.66V38.84H536.584V62.22H505.784V76.22H540.784V101H474.704V1.88H540.784V26.66H505.784ZM588.477 101.98C576.624 101.98 566.824 99.2267 559.077 93.72C551.424 88.12 547.27 79.9533 546.617 69.22H579.657C580.124 74.9133 582.644 77.76 587.217 77.76C588.897 77.76 590.297 77.3867 591.417 76.64C592.63 75.8 593.237 74.54 593.237 72.86C593.237 70.5267 591.977 68.66 589.457 67.26C586.937 65.7667 583.017 64.0867 577.697 62.22C571.35 59.98 566.077 57.7867 561.877 55.64C557.77 53.4933 554.224 50.3667 551.237 46.26C548.25 42.1533 546.804 36.88 546.897 30.44C546.897 24 548.53 18.54 551.797 14.06C555.157 9.48666 559.684 6.03333 565.377 3.69999C571.164 1.36666 577.65 0.199996 584.837 0.199996C596.97 0.199996 606.584 3 613.677 8.6C620.864 14.2 624.644 22.0867 625.017 32.26H591.557C591.464 29.46 590.764 27.4533 589.457 26.24C588.15 25.0267 586.564 24.42 584.697 24.42C583.39 24.42 582.317 24.8867 581.477 25.82C580.637 26.66 580.217 27.8733 580.217 29.46C580.217 31.7 581.43 33.5667 583.857 35.06C586.377 36.46 590.344 38.1867 595.757 40.24C602.01 42.5733 607.144 44.8133 611.157 46.96C615.264 49.1067 618.81 52.0933 621.797 55.92C624.784 59.7467 626.277 64.5533 626.277 70.34C626.277 76.4067 624.784 81.8667 621.797 86.72C618.81 91.48 614.47 95.2133 608.777 97.92C603.084 100.627 596.317 101.98 588.477 101.98Z"
      fill="#212830"
    />
  </svg>
);
const TitleTypographyEN = styled(_TitleTypographyEN)`
  ${titleTypographyStyles}
`;
const _TitleTypographyKO: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="612"
    height="127"
    viewBox="0 0 612 127"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M116.262 69.3867H0.871094V86.8867H24.9336V126.535H47.3555V86.8867H69.0938V126.535H91.3789V86.8867H116.262V69.3867ZM11.3984 33.0195C11.3301 50.1777 30.6758 61.1836 58.1562 61.1836C85.6367 61.1836 105.256 50.1777 105.324 33.0195C105.256 15.3145 85.6367 3.83008 58.1562 3.89844C30.6758 3.83008 11.3301 15.3145 11.3984 33.0195ZM33.957 33.0195C33.8887 24.9531 42.9805 21.2617 58.1562 21.2617C73.6055 21.2617 82.4922 24.9531 82.4922 33.0195C82.4922 40.4707 73.6055 43.957 58.1562 44.0938C42.9805 43.957 33.8887 40.4707 33.957 33.0195ZM227.212 0.0703125H205.063V43H185.786V60.6367H205.063V126.945H227.212V0.0703125ZM116.47 86.75L129.458 104.113C143.882 97.209 153.042 84.4258 158.237 68.7715C163.432 83.332 172.456 95.0215 186.743 101.516L199.595 84.2891C176.762 74.6504 169.448 51.8867 169.243 29.1914H193.852V11.8281H122.212V29.1914H146.821C146.548 52.9121 139.302 76.4961 116.47 86.75ZM380.479 94.9531H264.952V112.863H380.479V94.9531ZM273.291 27.5508H289.151V62.0039H273.975V79.2305H371.045V62.0039H355.459V27.5508H371.729V10.1875H273.291V27.5508ZM311.026 62.0039V27.5508H333.721V62.0039H311.026ZM498.675 95.7734H451.644V79.6406H489.105V62.0039H417.737V51.8867H486.234V7.58984H395.589V25.0898H464.495V34.9336H395.726V79.6406H429.905V95.7734H383.148V113.547H498.675V95.7734ZM608.395 0.0703125H586.383V64.6016H608.395V0.0703125ZM503.395 46.5547L505.582 63.3711C527.32 63.3711 555.484 62.8926 580.504 58.5859L579.547 43C575.309 43.5469 571.002 43.957 566.559 44.3672V23.8594H575.582V7.45312H506.676V23.8594H515.289V46.418C511.119 46.4863 507.154 46.4863 503.395 46.5547ZM520.484 85.6562H586.793V89.4844H520.621V125.988H611.129V109.035H542.359V104.934H608.395V68.8398H520.484V85.6562ZM536.207 46.0078V23.8594H545.641V45.666C542.496 45.8027 539.352 45.8711 536.207 46.0078Z"
      fill="#212830"
    />
  </svg>
);
const TitleTypographyKO = styled(_TitleTypographyKO)`
  ${titleTypographyStyles}
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 42px;

  @media (max-width: 1400px) {
    gap: 36px;
  }

  @media (max-width: 1280px) {
    gap: 28px;
  }

  @media (max-width: 732px) {
    gap: 20px;
  }
`;
const Row = styled.div`
  height: 400px;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 42px;

  @media (max-width: 1400px) {
    gap: 36px;
  }

  @media (max-width: 1280px) {
    gap: 28px;
  }

  @media (max-width: 1110px) {
    justify-content: center;
    align-items: flex-start;
  }

  @media (max-width: 735px) {
    flex-direction: column;
    height: unset;
  }
`;
