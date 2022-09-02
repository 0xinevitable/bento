import React, { useState } from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';
import { LinkBlockItem } from '@/profile/blocks/LinkBlockItem';
import { TextBlockItem } from '@/profile/blocks/TextBlockItem';
import { VideoBlockItem } from '@/profile/blocks/VideoBlockItem';
import { Block } from '@/profile/blocks/types';

import { SyncRSSButton } from './SyncRSSButton';
import { SyncRSSModal } from './SyncRSSModal';

type Props = {
  isMyProfile: boolean;
  blocks: Block[] | null;
};

export const ProfileLinkSection: React.FC<Props> = ({
  isMyProfile,
  blocks,
}) => {
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

      {!!blocks ? (
        blocks.map((item, index) => {
          if (item.type === 'link') {
            return <LinkBlockItem key={`link-${index}`} {...item} />;
          }
          if (item.type === 'text') {
            return <TextBlockItem key={`text-${index}`} {...item} />;
          }
          if (item.type === 'video') {
            return <VideoBlockItem key={`video-${index}`} {...item} />;
          }
        })
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
