import dedent from 'dedent';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';
import { UserProfile } from '@/profile/types/UserProfile';

import { usePalette } from '../hooks/usePalette';

const data = {
  color: '#ff3856',
  background: dedent`
      linear-gradient(to right bottom, #E35252 0%, #DB6E57 29.47%, #C22E3A 65.1%)
    `,
};

type Props = {
  profile?: UserProfile;
};

export const ProfileViewer: React.FC<Props> = ({ profile }) => {
  const palette = usePalette(data.color);

  const displayName = useMemo(() => {
    const value = profile?.display_name || profile?.username;
    if (typeof value === 'undefined') {
      return null;
    }
    return value;
  }, [profile]);

  return (
    <>
      {typeof displayName === 'string' ? (
        displayName.length > 0 ? (
          <DisplayName>{displayName}</DisplayName>
        ) : null
      ) : (
        <DefaultSkeleton
          style={{
            height: '34px',
            width: '120px',
            marginBottom: '10px',
          }}
        />
      )}
      {typeof profile?.username === 'string' ? (
        <Username style={{ color: palette.primary }}>
          {`@${profile.username || 'unknown'}`}
        </Username>
      ) : (
        <DefaultSkeleton
          style={{
            height: '19px',
            width: '80px',
            marginBottom: '10px',
          }}
        />
      )}
      {typeof profile?.bio === 'string' ? (
        profile.bio.length > 0 ? (
          <Bio>{profile.bio}</Bio>
        ) : null
      ) : (
        <DefaultSkeleton
          style={{
            height: '22px',
            width: '200px',
          }}
        />
      )}
    </>
  );
};

const DisplayName = styled.h1`
  margin: 0;
  font-weight: 900;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  color: #ffffff;
`;

const DefaultSkeleton = styled(Skeleton)`
  border-radius: 6px;
  align-self: center;
`;

const Username = styled.p`
  margin: 4px 0 0;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
`;

const Bio = styled.p`
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  white-space: break-spaces;
`;
