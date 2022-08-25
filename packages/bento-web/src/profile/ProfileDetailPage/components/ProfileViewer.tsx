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
    <Column>
      {typeof displayName === 'string' ? (
        displayName.length > 0 ? (
          <DisplayName>{displayName}</DisplayName>
        ) : null
      ) : (
        <DefaultSkeleton
          style={{
            height: '32px',
            width: '160px',
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
            height: '21.6px',
            width: '80px',
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
            height: '19.2px',
            width: '200px',
          }}
        />
      )}
    </Column>
  );
};

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const DisplayName = styled.h1`
  margin: 0;
  font-weight: 900;
  font-size: 32px;
  line-height: 100%;
  color: #ffffff;
`;

const DefaultSkeleton = styled(Skeleton)`
  border-radius: 6px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 18px;
  line-height: 120%;
`;

const Bio = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 16px;
  line-height: 120%;

  color: rgba(255, 255, 255, 0.8);
  white-space: break-spaces;
`;
