import { BentoUser } from '@bento/common';
import styled from '@emotion/styled';
import { Avatar, Text, useTheme } from '@geist-ui/core';

import { formatUsername } from '@/utils/format';

import { Breakpoints } from '../constants/breakpoints';

type UserProfileProps = {
  user: BentoUser;
};

export const UserProfileSection: React.FC<UserProfileProps> = ({ user }) => {
  const { palette } = useTheme();

  return (
    <ProfileContainer>
      {user.profileImage ? (
        <ImageAvatar src={user.profileImage} />
      ) : (
        <Avatar text={(user.displayName || user.username)[0]} scale={3} />
      )}

      <div>
        <Text h3 style={{ color: palette.accents_8, lineHeight: 1 }}>
          {user.displayName}
        </Text>
        <Text
          span
          style={{ marginTop: 6, color: palette.accents_6, lineHeight: 1 }}
        >
          {formatUsername(user.username)}
        </Text>
      </div>
    </ProfileContainer>
  );
};

const ImageAvatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;

  border: 1px solid #333;
  vertical-align: top;
  background-color: #000;
`;
const ProfileContainer = styled.div`
  padding: 0 32px;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: ${Breakpoints.Tablet}px) {
    padding: 0 24px;
  }

  @media (max-width: ${Breakpoints.Mobile}px) {
    padding: 0;
  }
`;
