import React from 'react';
import styled from 'styled-components';

import { ProfileInstance } from '@/profile/components/ProfileInstance';
import { UserProfile } from '@/profile/types/UserProfile';

type PreviewProps = {
  profileDraft?: Omit<UserProfile, 'user_id'>;
};

export const Preview: React.FC<PreviewProps> = ({ profileDraft }) => {
  return (
    <Wrapper>
      <Container>
        <Card>
          {/* FIXME: */}
          <ProfileInstance profile={profileDraft as any} />
        </Card>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  flex: 1;
  position: sticky;
  top: 0;
  overflow-y: auto;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type CardProps = {
  children?: React.ReactNode;
};
const Card: React.FC<CardProps> = ({ children }) => (
  <CardWrapper>
    <CardContainer>{children}</CardContainer>
  </CardWrapper>
);
const CardWrapper = styled.div`
  margin: 48px 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;
const CardContainer = styled.div`
  margin: 8px;
  width: 412px;
  min-height: 812px;
  background-color: #171b20;
`;
