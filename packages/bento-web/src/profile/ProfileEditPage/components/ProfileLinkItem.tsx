import { ShadowedImage } from '@/profile/components/ShadowedImage';
import { ProfileLink } from '@/profile/types/UserProfile';
import React from 'react';
import styled from 'styled-components';

type Props = ProfileLink & {};

export const ProfileLinkItem: React.FC<Props> = ({
  title,
  description,
  href,
  image,
}) => {
  return (
    <Container>
      <LinkImageWrapper>
        <LinkImage src={image} />
      </LinkImageWrapper>
      <Information>
        <BoldInput placeholder="이름" defaultValue={title}></BoldInput>
        <Input placeholder="설명" defaultValue={description}></Input>
        <Input placeholder="링크" defaultValue={href}></Input>
      </Information>
    </Container>
  );
};

const Container = styled.li`
  margin-top: 4px;
  margin-bottom: 12px;
  padding: 16px;
  background-color: #262b34;
  border-radius: 8px;
  display: flex;
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
  margin-left: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 9;
`;

const BoldInput = styled.input`
  margin: 0;
  padding: 12px 8px;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: black;
  word-break: keep-all;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.25);
  color: rgba(255, 255, 255, 0.85);
`;

const Input = styled.input`
  margin: 0;
  padding: 12px 8px;
  margin-top: 8px;
  font-size: 20px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.25);
`;
