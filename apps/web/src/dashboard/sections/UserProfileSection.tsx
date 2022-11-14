import styled from '@emotion/styled';
import { Avatar, Text, useTheme } from '@geist-ui/core';

import { formatUsername } from '@/utils/format';

import { UserProfile } from '@/profile/types/UserProfile';

import { Breakpoints } from '../constants/breakpoints';

type UserProfileProps = {
  profile: UserProfile;
};

export const UserProfileSection: React.FC<UserProfileProps> = ({ profile }) => {
  const { palette } = useTheme();

  return (
    <ProfileContainer>
      {profile.images?.[0] ? (
        <ImageAvatar src={profile.images[0]} />
      ) : (
        <Avatar
          text={(profile.display_name || profile.username)[0]}
          scale={3}
        />
      )}

      <div>
        <Text
          h3
          className="sys"
          style={{ color: palette.accents_8, lineHeight: 1 }}
        >
          {profile.display_name}
        </Text>
        <Text
          span
          className="sys"
          style={{ marginTop: 6, color: palette.accents_6, lineHeight: 1 }}
        >
          {formatUsername(profile.username)}
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
