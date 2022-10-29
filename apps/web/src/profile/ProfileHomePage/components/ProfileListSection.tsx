import styled from '@emotion/styled';
import React from 'react';

import {
  RoundProfile,
  RoundProfileProps,
} from '@/profile/components/RoundProfile';

type Props = {
  title: string;
  profiles: RoundProfileProps[];
};

export const ProfileListSection: React.FC<Props> = ({ title, profiles }) => {
  return (
    <section>
      <Title>{title}</Title>
      <ProfileListWrapper>
        <ProfileListContainer>
          {profiles.map(({ title, image }, index) => {
            return (
              <RoundProfile
                // TODO: Use data identifier(e.g. username) as key
                key={index}
                title={title}
                image={image}
              />
            );
          })}
        </ProfileListContainer>
        <ProfileListRightGradient />
      </ProfileListWrapper>
    </section>
  );
};

const Title = styled.h2`
  padding: 32px 20px 0;
  color: rgba(255, 255, 255, 0.95);
`;

const ProfileListWrapper = styled.div`
  position: relative;
`;
const ProfileListContainer = styled.div`
  padding: 8px 20px;
  display: flex;
  overflow-y: auto;
  overflow-x: visible;

  &::-webkit-scrollbar {
    display: none;
  }

  & > div:not(:last-of-type) {
    margin-right: 12px;
  }
`;

const ProfileListRightGradient = styled.div`
  height: 100%;
  width: 32px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(10, 10, 13, 0.95)
  );
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10;
`;
