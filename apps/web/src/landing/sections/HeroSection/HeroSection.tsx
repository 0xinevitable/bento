import styled from '@emotion/styled';
import { Trans, useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@/components/v2/Button';

import { onTablet } from '@/landing/utils/breakpoints';
import { Analytics } from '@/utils';

import backgroundImage from './assets/hero-background.png';
import logoImage from './assets/hero-logo.jpg';

export const HeroSection: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation('landing');

  return (
    <>
      <LogoImageContainer>
        <LogoImage alt="" src={logoImage} priority quality={100} />
      </LogoImageContainer>

      <Container>
        <BackgroundImageContainer>
          <BackgroundImage
            alt=""
            src={backgroundImage}
            priority
            quality={100}
          />
        </BackgroundImageContainer>
        <Content>
          <Title>
            <Trans
              t={t}
              i18nKey="HERO_TITLE"
              components={{
                InlineBlock: <InlineBlock />,
              }}
            />
          </Title>
          <Description>
            <Trans
              t={t}
              i18nKey="HERO_DESC"
              components={{ InlineBlock: <InlineBlock /> }}
            />
          </Description>

          <ButtonContainer>
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
          </ButtonContainer>
        </Content>

        <AwardList>
          <AwardImage
            alt="KLAYMAKERS22 Fi+ Track - Second Place"
            src="/assets/landing/klaymakers-1.svg"
          />
          <AwardImage
            alt="KLAYMAKERS22 The Ground X Challenge - Winner"
            src="/assets/landing/klaymakers-2.svg"
          />
        </AwardList>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex-direction: column;
  align-items: center;

  position: relative;
  z-index: 0;
  margin-top: -66px;
`;
const BackgroundImageContainer = styled.div`
  position: absolute;
  top: 55px;
  z-index: -1;
`;
const BackgroundImage = styled(Image)`
  width: 900px;
  height: 437px;
`;
const LogoImageContainer = styled.div`
  width: 100%;

  position: absolute;
  top: 66px;
  z-index: 100;

  display: flex;
  justify-content: center;
  pointer-events: none;

  @media screen and (max-width: 600px) {
    top: 120px;
  }
`;
const LogoImage = styled(Image)`
  width: 156px;
  height: 156px;

  background: linear-gradient(
    224.7deg,
    #ff9898 8.17%,
    #ff77b8 54.56%,
    #f9baff 100%
  );
  outline: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;

const Content = styled.div`
  margin-top: 274px;
  padding-top: 54px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  ${onTablet} {
    padding-left: 16px;
    padding-right: 16px;
    gap: 20px;
  }

  @media screen and (max-width: 600px) {
    margin-top: 328px;
  }
`;

const Title = styled.h1`
  width: 100%;
  max-width: 670px;

  font-weight: 900;
  font-size: 52px;
  line-height: 100%;
  text-align: center;
  color: #ffffff;

  ${onTablet} {
    font-size: 36px;
  }

  &:lang(ko) {
    line-height: 128%;
  }
`;
const InlineBlock = styled.span`
  display: inline-block;
`;
const Description = styled.p`
  width: 100%;
  max-width: 530px;

  font-weight: 500;
  font-size: 24px;
  line-height: 128%;
  text-align: center;
  color: #aeb3d8;

  ${onTablet} {
    max-width: 400px;
    font-size: 18px;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const AwardList = styled.div`
  margin-top: 56px;
  display: flex;
  align-items: center;
  gap: 16px;

  @media screen and (max-width: 440px) {
    flex-direction: column;
    gap: 24px;
  }
`;
const AwardImage = styled.img`
  width: 240px;
  height: 112px;
  object-fit: contain;

  ${onTablet} {
    width: 192px;
    height: 90px;
  }
`;
