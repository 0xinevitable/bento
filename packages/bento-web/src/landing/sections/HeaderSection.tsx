import dedent from 'dedent';
import { motion } from 'framer-motion';
import Link from 'next/link';
import styled from 'styled-components';

const ASSETS = {
  ILLUST: [
    '/assets/landing/header-illust.png',
    '/assets/landing/header-illust@2x.png',
  ],
  PAWN: [
    '/assets/landing/header-pawn.png',
    '/assets/landing/header-pawn@2x.png',
  ],
};

const float = (y: number, reverse: boolean = false) => ({
  initial: { y: !reverse ? -y : y },
  animate: { y: !reverse ? y : -y },
  transition: {
    ease: 'linear',
    repeat: Infinity,
    repeatType: 'mirror',
    duration: 2,
  } as const,
});

export const HeaderSection: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Title>
          <span>
            The <span style={{ display: 'inline-block' }}>blockchain is</span>
          </span>
          {`\n`}
          <span>{` a pretty big space.`}</span>
        </Title>

        <IllustWrapper>
          <IllustContainer>
            <MainIllust>
              <Illust
                src={ASSETS.ILLUST[0]}
                srcSet={dedent`
              ${ASSETS.ILLUST[0]} 1x,
              ${ASSETS.ILLUST[1]} 2x
            `}
              />

              <Pawn
                src={ASSETS.PAWN[0]}
                srcSet={dedent`
              ${ASSETS.PAWN[0]} 1x,
              ${ASSETS.PAWN[1]} 2x
            `}
                initial={{ y: 5, scale: 1, rotate: 10 }}
                animate={{ y: 5, scale: 1.1, rotate: 10 }}
                transition={{
                  ease: 'linear',
                  repeat: Infinity,
                  repeatType: 'mirror',
                  duration: 2,
                }}
              />
            </MainIllust>

            <IRAbsoluteContainer {...float(8, true)}>
              <IRContainer>
                <IRButton>SEARCHING INVESTORS</IRButton>
                <IRHelp {...float(2, true)}>Talk with us</IRHelp>
              </IRContainer>
            </IRAbsoluteContainer>

            <CTAAbsoluteContainer>
              <CTAContainer>
                <Link href="/home">
                  <CTAButton>Find your Identity</CTAButton>
                </Link>
                <CTAHelp {...float(8)}>Merge your wallets into one</CTAHelp>
              </CTAContainer>
            </CTAAbsoluteContainer>
          </IllustContainer>
        </IllustWrapper>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 0 32px;

  background-image: url('/assets/landing/header-background.jpg');
  background-size: 100% 100%;
  background-position: center;

  @media screen and (max-width: 620px) {
    padding: 0 20px;
  }
`;
const Container = styled.section`
  padding-top: 130px;
  height: 584.74px;
  position: relative;

  img,
  button {
    user-select: none;
  }

  @media screen and (max-width: 665px) {
    height: fit-content;
  }
`;
const Title = styled.h1`
  width: fit-content;
  margin: 0 auto;

  font-weight: 900;
  font-size: 64px;
  font-variant: small-caps;
  line-height: 83%;

  text-align: center;
  letter-spacing: -0.5px;

  color: #ffffff;

  display: flex;
  flex-direction: column;

  & > span {
    width: fit-content;

    &:last-of-type {
      margin-top: 4px;
      margin-left: 72px;
    }
  }

  @media screen and (max-width: 620px) {
    font-size: 48px;

    & > span:last-of-type {
      margin-left: 0;
    }
  }
`;

const AbsoluteContainer = styled(motion.div)`
  position: absolute;
`;

const IRAbsoluteContainer = styled(AbsoluteContainer)`
  top: 152px;
  left: -42px;

  @media screen and (max-width: 840px) {
    top: 107px;
    left: 44px;
  }

  @media screen and (max-width: 665px) {
    display: none;
  }
`;
const IRContainer = styled.div`
  position: relative;
  width: 268px;
  height: 117.1px;
`;
const IRButton = styled.button`
  padding: 13.31px 20.36px;
  background: linear-gradient(155.97deg, #ffd978 15.42%, #d09600 102.91%);
  box-shadow: 0px 3.13px 12.53px rgba(250, 209, 105, 0.3);
  border-radius: 8px;
  transform: rotate(-16deg);

  position: absolute;
  top: 35.74px;
  left: 1.14px;

  font-family: 'Poppins';
  font-weight: 800;
  font-size: 18.8px;
  line-height: 100%;
  text-align: center;
  letter-spacing: 0.01em;
  color: #000000;

  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0px 4px 24px rgba(250, 209, 105, 0.55);
  }

  &:focus {
    filter: opacity(0.66);
  }
`;
const IRHelp = styled(motion.span)`
  padding: 6px 8px;
  background-color: rgba(64, 36, 8, 0.8);
  border: 1px solid #ffda79;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.44);
  border-radius: 8px;

  position: absolute;
  top: 18px;
  left: 41px;

  font-weight: 700;
  font-size: 16px;
  line-height: 103%;
  text-align: center;
  color: #fcd570;
`;

const CTAAbsoluteContainer = styled(AbsoluteContainer)`
  top: 220px;
  right: -107px;

  @media screen and (max-width: 840px) {
    top: 201px;
    right: -33px;
  }

  @media screen and (max-width: 712px) {
    right: -15px;
  }

  @media screen and (max-width: 665px) {
    top: -29px;
    right: 0;
    left: 0;

    display: flex;
    justify-content: center;
  }
`;
const CTAContainer = styled.div`
  width: 362px;
  height: 136.46px;
  position: relative;

  @media screen and (max-width: 840px) {
    width: 272px;
    height: 140px;
  }

  @media screen and (max-width: 665px) {
    width: 208px;
    height: 49px;
  }
`;
const CTAButton = styled.button`
  padding: 17px 26px;
  background: linear-gradient(180deg, #ff214a 0%, #c60025 100%);
  box-shadow: 0px 4px 16px rgba(255, 33, 74, 0.44);
  border-radius: 8px;
  transform: rotate(-18deg);

  position: absolute;
  top: 38.73px;
  left: 2.75px;

  font-weight: 800;
  font-size: 24px;
  line-height: 103%;
  text-align: center;
  letter-spacing: 0.01em;
  color: #ffffff;

  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0px 4px 24px rgba(255, 33, 74, 0.55);
  }

  &:focus {
    filter: opacity(0.66);
  }

  @media screen and (max-width: 665px) {
    width: 208px;
    height: 49px;
    padding: 0;

    top: 0;
    left: 0;
    font-size: 18px;
    transform: rotate(0);
  }
`;
const CTAHelp = styled(motion.span)`
  width: fit-content;
  padding: 6px 8px;

  background: rgba(51, 9, 17, 0.75);
  border: 1px solid #ff214a;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.44);
  border-radius: 8px;

  position: absolute;
  top: 87px;
  left: 133px;

  font-weight: 700;
  font-size: 16px;
  line-height: 103%;
  text-align: center;
  color: #ff214a;

  @media screen and (max-width: 840px) {
    top: unset;
    left: unset;
    right: 0;
    bottom: 0;
  }

  @media screen and (max-width: 665px) {
    width: unset;
    bottom: -19px;
    right: -70px;
  }
`;

const IllustWrapper = styled.div`
  position: absolute;
  margin: auto;
  top: 171px;
  left: 0;
  right: 0;

  margin-left: -6%;
  display: flex;
  justify-content: center;

  @media screen and (max-width: 665px) {
    position: static;
    margin-left: -10%;
  }

  @media screen and (max-width: 665px) {
    margin-left: 0;
    margin-top: ${28 + 20}px;
  }
`;
const IllustContainer = styled.div`
  position: relative;
  min-width: 662px;
  width: 662px;
  height: 413.74px;

  @media screen and (max-width: 665px) {
    min-width: unset;
    width: 100%;

    display: flex;
    justify-content: center;
  }
`;
const MainIllust = styled.div`
  @media screen and (max-width: 665px) {
    margin-left: -8%;
    position: relative;
    width: 662px;
    min-width: 662px;
  }
`;

const ILLUST_BLUR_LEFT = 80;
const ILLUST_BLUR_RIGHT = 32;
const ILLUST_BLUR_BOTTOM = 80 - 61.74;
const Illust = styled.img`
  margin-left: ${-ILLUST_BLUR_LEFT}px;
  margin-right: ${-ILLUST_BLUR_RIGHT}px;
  margin-bottom: ${-ILLUST_BLUR_BOTTOM}px;
  width: ${662 + ILLUST_BLUR_LEFT + ILLUST_BLUR_RIGHT}px;
  height: ${413.74 + ILLUST_BLUR_BOTTOM}px;
`;

const Pawn = styled(motion.img)`
  width: ${413.74 + ILLUST_BLUR_BOTTOM}px;
  height: ${413.74 + ILLUST_BLUR_BOTTOM}px;

  position: absolute;
  top: 0;
  left: ${173.3 - ILLUST_BLUR_LEFT + ILLUST_BLUR_RIGHT}px;
  bottom: 0;
`;
