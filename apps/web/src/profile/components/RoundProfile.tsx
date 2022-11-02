import styled from '@emotion/styled';
import { animated, useSpring } from '@react-spring/web';
import React, { useState } from 'react';

import { ShadowedImage } from './ShadowedImage';

export type RoundProfileProps = {
  title: string;
  image: string;
};

export const RoundProfile: React.FC<RoundProfileProps> = ({ title, image }) => {
  const [hovered, setHovered] = useState<boolean>(false);

  const from = {
    opacity: 0.45,
    transform: 'translateY(0px)',
  };
  const to = {
    opacity: 1,
    transform: 'translateY(8px)',
  };
  const titleStyle = useSpring({
    from: hovered ? from : to,
    to: hovered ? to : from,
  }) as unknown as { opacity: number; transform: string };

  return (
    <Container
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <ProfileImageWrapper>
        <ProfileContainer>
          <ProfileImage src={image} />
        </ProfileContainer>
      </ProfileImageWrapper>

      <Title style={titleStyle}>{title}</Title>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfileImageWrapper = styled.div`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  height: 112px;
  width: 112px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to right, #0038ff, #6be7e2);

  &:hover {
    transform: scale(1.05);

    img:last-of-type {
      filter: blur(8px);
      opacity: 0.65;
    }
  }
`;
const ProfileContainer = styled.div`
  padding: 6px;
  border-radius: 50%;
  background-color: black;

  & > div {
    z-index: 6;

    & > img:last-of-type {
      filter: blur(8px);
      opacity: 0.4;
    }
  }
`;
const ProfileImage = styled(ShadowedImage)`
  height: 96px;
  width: 96px;
  border-radius: 50%;
`;

const Title = styled(animated.span)`
  margin-top: 4px;
  font-size: 1rem;
  font-weight: bold;
  color: white;
`;
