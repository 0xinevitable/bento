import styled from '@emotion/styled';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@/components/v2/Button';

import backgroundImage from '@/landing/sections/HeroSection/assets/hero-background.png';

const ConstructionPage: NextPage = () => {
  const router = useRouter();
  // const { t } = useTranslation('landing');

  return (
    <>
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
          <Image
            src="/assets/default-zap.png"
            alt=""
            priority
            width={100}
            height={100}
          />
          <Title>Bento is Under Construction</Title>
          <Description>
            We appreciate your interest in Bento. Our services are{' '}
            <span>momentarily paused</span> as we are improving our system.
          </Description>

          <ButtonContainer>
            <Input placeholder="Your Email" />
            <Button onClick={async () => {}}></Button>
          </ButtonContainer>
        </Content>
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
`;
const BackgroundImageContainer = styled.div`
  position: absolute;
  z-index: -1;
  top: -10px;
`;
const BackgroundImage = styled(Image)`
  width: 900px;
  height: 437px;
`;

const Content = styled.div`
  margin-top: 98px; // 70 + 28
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const Title = styled.h1`
  width: 100%;
  max-width: 230px;

  color: #fff;
  text-align: center;
  font-size: 32px;
  font-weight: 900;
  line-height: 100%;
`;
const Description = styled.p`
  width: 100%;
  max-width: 310px;

  color: #aeb3d8;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  line-height: 128%;
  letter-spacing: 0;

  & > span {
    font-style: italic;
    font-weight: bold;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Input = styled.input`
  display: flex;
  flex: 1;
  height: 60px;
  padding: 20px;
  align-items: center;

  border-radius: 8px;
  background: #1d1e2b;

  color: rgb(201, 206, 251); // c9cefb
  font-size: 18px;
  font-weight: 500;
  line-height: 100%;

  &::placeholder {
    color: rgba(201, 206, 251, 0.8);
  }
`;

export default ConstructionPage;
