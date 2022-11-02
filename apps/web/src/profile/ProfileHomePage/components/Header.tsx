import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React from 'react';

import { formatUsername } from '@/utils/format';

// import { Analytics } from '@/utils';
import { ExampleUserProfile } from '@/profile/constants/ExampleUserProfile';

export const Header = () => {
  const router = useRouter();

  return (
    <Container>
      <Profile
        title="My Profile"
        onClick={async (event) => {
          event.preventDefault();
          // await Analytics.logEvent('click_home_header_profile');
          router.push('/profile/account');
        }}
      >
        <Avatar src={ExampleUserProfile.images?.[0] ?? ''} />
        <Title>{ExampleUserProfile.display_name}</Title>
        <Username>{formatUsername(ExampleUserProfile.username)}</Username>
      </Profile>
    </Container>
  );
};

const Container = styled.header`
  margin: 32px 20px 0;
`;
const Profile = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    transform-origin: center;
  }
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;
const Title = styled.span`
  margin-top: 16px;
  font-size: 1.45rem;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.85);
`;
const Username = styled.span`
  margin-top: 2px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
`;
