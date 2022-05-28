import styled from 'styled-components';

import { systemFontStack } from '@/styles/fonts';

const LandingPage = () => {
  return (
    <Container>
      <Title>
        Bento,
        <br />
        The Web3 SuperApp
      </Title>

      <ButtonLink href="https://app.bento.finance">
        <Button>Launch App</Button>
      </ButtonLink>
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0;
  margin-top: 48px;

  font-weight: 900;
  font-family: ${systemFontStack};
  font-size: 4.6rem;
  text-align: center;
  line-height: 1;
  letter-spacing: -0.8px;
`;

const ButtonLink = styled.a`
  margin: 0 auto;
  margin-top: 32px;
`;

const Button = styled.button`
  padding: 16px 32px;
  cursor: pointer;

  font-weight: bold;
  font-family: ${systemFontStack};
  font-size: 24px;
  text-align: center;
  line-height: 1;
  letter-spacing: -0.8px;
`;
