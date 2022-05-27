import React from 'react';
import styled from 'styled-components';

import { ShadowedImage } from '../../components/ShadowedImage';
import { ProfileLink } from '../../types/UserProfile';

type Props = ProfileLink & {};

export const ProfileLinkItem: React.FC<Props> = ({
  title,
  description,
  href,
  image,
}) => {
  return (
    <Wrapper>
      <Link href={href} rel="nofollow" target="_blank">
        <Container>
          <LinkImageWrapper>
            <LinkImage src={image} />
          </LinkImageWrapper>
          <Information>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </Information>
        </Container>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.li`
  margin-top: 8px;
  cursor: pointer;
`;
const Link = styled.a``;
const Container = styled.div`
  display: flex;
  padding: 12px;
  background-color: #262b34;
  border-radius: 8px;
`;

const LinkImageWrapper = styled.div`
  z-index: 9;
`;

const LinkImage = styled(ShadowedImage)`
  width: 86px;
  height: 86px;
`;

const Information = styled.div`
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 9;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: white;
  word-break: keep-all;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);
`;
