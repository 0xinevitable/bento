import React, { useState } from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';

import { ProfileLink } from '../../types/UserProfile';
import { ProfileLinkItem } from './ProfileLinkItem';
import { SyncRSSButton } from './SyncRSSButton';
import { SyncRSSModal } from './SyncRSSModal';

type Props = {
  isMyProfile: boolean;
  items: ProfileLink[] | null;
};

export const ProfileLinkSection: React.FC<Props> = ({ isMyProfile, items }) => {
  const isSyncRSSButtonShown = !!isMyProfile;
  const [isSyncRSSModalVisible, setSyncRSSModalVisible] =
    useState<boolean>(false);

  return (
    <ProfileLinkList>
      {isSyncRSSButtonShown && (
        <>
          <SyncRSSButton
            onClick={() => setSyncRSSModalVisible((prev) => !prev)}
          />
          <SyncRSSModal
            isVisible={isSyncRSSModalVisible}
            onDismiss={() => setSyncRSSModalVisible((prev) => !prev)}
          />
        </>
      )}

      {!!items ? (
        items?.map((item, index) => (
          <ProfileLinkItem key={`item-${index}`} {...item} />
        ))
      ) : (
        <>
          <LinkSkeleton />
          <LinkSkeleton />
          <LinkSkeleton />
        </>
      )}
    </ProfileLinkList>
  );
};

const ProfileLinkList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const LinkSkeleton = styled(Skeleton)`
  width: 100%;
  height: 110px;
  margin-top: 8px;
  border-radius: 8px;
  align-self: center;
`;
