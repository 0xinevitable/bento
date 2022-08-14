import axios from 'axios';
import dedent from 'dedent';
import { GetServerSideProps } from 'next';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { UserProfile } from '@/profile/types/UserProfile';
import { FeatureFlags } from '@/utils/FeatureFlag';

import { usePalette } from '../hooks/usePalette';

type ProfileInfoProps = {
  currentProfile: UserProfile | null;
};

const data = {
  color: '#ff3856',
  background: dedent`
      linear-gradient(to right bottom, #E35252 0%, #DB6E57 29.47%, #C22E3A 65.1%)
    `,
};

export const ProfileEditor: React.FC<ProfileInfoProps> = ({
  currentProfile,
}) => {
  const palette = usePalette(data.color);

  const [username, setUsername] = useState<string>(
    currentProfile?.username ?? '',
  );
  const [displayName, setDisplayName] = useState<string>(
    currentProfile?.display_name ?? '',
  );
  const [bio, setBio] = useState<string>(currentProfile?.bio ?? '');

  const onSubmit = useCallback(async () => {
    const { data } = await axios.post(`/api/profile`, {
      username,
      display_name: displayName,
      bio,
    });
    console.log(data);
  }, [username, displayName, bio]);

  return (
    <Container>
      <NameField
        placeholder="Name"
        defaultValue={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <UserNameField
        style={{ color: palette.primary }}
        placeholder="@username"
        defaultValue={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <BioField
        placeholder="Description"
        defaultValue={bio}
        onChange={(e) => setBio(e.target.value)}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const ProfileInfoInput = styled.input`
  position: relative;
  border-radius: 8px;
  align-self: center;
  margin-bottom: 10px;

  text-align: center;
  color: #ffffff;

  background-color: #171717;
`;

const NameField = styled(ProfileInfoInput)`
  width: 55%;
  height: 44px;
  font-weight: 900;
  font-size: 28px;
  line-height: 34px;
`;

const UserNameField = styled(ProfileInfoInput)`
  height: 29px;
  width: 30%;
  margin-bottom: 20px;
`;

const BioField = styled(ProfileInfoInput)`
  height: 32px;
  width: 90%;
`;
