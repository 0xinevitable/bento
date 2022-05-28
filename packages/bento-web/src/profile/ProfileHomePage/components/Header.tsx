import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

// import { Analytics } from '@/utils/analytics';
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
          router.push(`/${ExampleUserProfile.username}`);
        }}
      >
        <Avatar src={ExampleUserProfile.images[0]} />
        <Title>{ExampleUserProfile.displayName}</Title>
        <Username>{`@${ExampleUserProfile.username}`}</Username>
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
    transform-origin: center left;
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
  margin-top: 8px;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.45);
`;
