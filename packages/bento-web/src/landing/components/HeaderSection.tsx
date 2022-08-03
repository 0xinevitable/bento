import styled from 'styled-components';

import { systemFontStack } from '@/dashboard-landing/styles/fonts';

export const HeaderSection: React.FC = () => {
  return (
    <Container>
      <Title>
        <span>{`The blockchain is`}</span>
        {`\n`}
        <span>{` a pretty big space.`}</span>
      </Title>

      <IRContainer>
        <IRButton>SEARCHING INVESTORS</IRButton>
        <IRHelp>Talk with us</IRHelp>
      </IRContainer>

      <CTAContainer>
        <CTAButton>Find your Identity</CTAButton>
        <CTAHelp>Merge your wallets into one</CTAHelp>
      </CTAContainer>
    </Container>
  );
};

const Container = styled.section`
  padding-top: ${130 - 65}px;

  & > * {
    font-family: 'Raleway', ${systemFontStack};
  }
`;
const Title = styled.h1`
  font-weight: 900;
  font-size: 64px;
  font-variant: small-caps;
  line-height: 83%;

  text-align: center;
  letter-spacing: -0.5px;

  color: #ffffff;

  display: flex;
  flex-direction: column;

  & > span:last-of-type {
    margin-top: 4px;
    margin-left: 72px;
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
`;
const IRHelp = styled.span`
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

const CTAContainer = styled.div`
  width: 362px;
  height: 136.46px;
  position: relative;
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
`;
const CTAHelp = styled.span`
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
`;
