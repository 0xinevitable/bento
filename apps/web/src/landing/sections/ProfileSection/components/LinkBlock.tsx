import styled from '@emotion/styled';
import { HTMLMotionProps, motion } from 'framer-motion';

import { ShadowedImage } from '@/profile/components/ShadowedImage';
import { Colors } from '@/styles';

type Props = HTMLMotionProps<'div'> & {
  title: string;
  description: string;
};

export const DefaultLinkBlock: React.FC<Props> = ({
  title,
  description,
  ...props
}) => {
  return (
    <Container {...props}>
      <LinkImage className="img" src="/assets/landing/link-in-bio-image.png" />
      <Information>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </Information>
    </Container>
  );
};

const Container = styled(motion.div)`
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
  min-width: 86px;
  width: 86px;
  height: 86px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;

  & > span {
    max-width: calc(100% - 64px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
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

export const ImageLinkBlock = styled(DefaultLinkBlock)`
  width: fit-content;
  gap: 12px;
  flex-direction: column;
  align-items: center;

  div.img,
  img {
    width: 162px;
    height: 162px;
  }

  span {
    text-align: center;

    max-width: 162px;
  }
`;
