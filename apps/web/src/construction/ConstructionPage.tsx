import styled from '@emotion/styled';
import { Send } from 'lucide-react';
import { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';

import { Button } from '@/components/v2/Button';

import { Footer } from '@/landing/sections/Footer';
import backgroundImage from '@/landing/sections/HeroSection/assets/hero-background.png';
import { Colors } from '@/styles';

const ConstructionPage: NextPage = () => {
  const router = useRouter();
  // const { t } = useTranslation('landing');

  const [email, setEmail] = useState<string>('');
  const onSubmit: React.FormEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      console.log('email', email);
    },
    [email],
  );

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

          <form onSubmit={onSubmit}>
            <ButtonContainer>
              <Input
                placeholder="Your Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onSubmit(e);
                  }
                }}
              />
              <SendButton
                type="submit"
                style={{ width: 60, height: 60, padding: 0 }}
              >
                <Send style={{ color: Colors.gray800 }} />
              </SendButton>
            </ButtonContainer>
          </form>
        </Content>

        <Footer style={{ marginTop: 200, opacity: 0.8 }} />
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 0 16px;

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
  gap: 4px;
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

  &:focus {
    background: #333549;
  }
`;
const SendButton = styled(Button)`
  transition: all 0.12s ease;

  &:hover {
    background-color: ${Colors.gray100};
  }
`;

export default ConstructionPage;
