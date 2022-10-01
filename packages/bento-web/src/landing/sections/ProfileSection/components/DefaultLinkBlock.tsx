import styled from 'styled-components';

import { ShadowedImage } from '@/profile/components/ShadowedImage';
import { Colors } from '@/styles';

type Props = React.HTMLAttributes<HTMLDivElement>;

export const DefaultLinkBlock: React.FC<Props> = (props) => {
  return (
    <Container {...props}>
      <LinkImage src="/assets/landing/link-in-bio-image.png" />
      <Information>
        <Title>Where I get my clothes!</Title>
        <Description>30% Discount</Description>
      </Information>
    </Container>
  );
};

const Container = styled.div`
  padding: 16px;
  width: 343px;

  display: flex;
  gap: 16px;

  background: linear-gradient(180deg, #272c33 0%, rgba(39, 56, 80, 0.51) 100%);
  backdrop-filter: blur(8px);
  border-radius: 8px;

  filter: drop-shadow(0px 8px 12px rgba(0, 0, 0, 0.18));
`;

const LinkImage = styled(ShadowedImage)`
  width: 86px;
  height: 86px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;
const Title = styled.span`
  font-weight: 800;
  font-size: 18px;
  line-height: 120%;
  letter-spacing: -0.3px;
  color: ${Colors.white};
`;
const Description = styled.span`
  font-weight: 400;
  font-size: 15px;
  line-height: 120%;
  letter-spacing: -0.3px;
  color: rgba(255, 255, 255, 0.8);
`;
