import { useRouter } from 'next/router';
import React from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';
import { FeatureFlags } from '@/utils/FeatureFlag';

import { LinkBlockItem } from '@/profile/blocks/LinkBlockItem';
import { TextBlockItem } from '@/profile/blocks/TextBlockItem';
import { VideoBlockItem } from '@/profile/blocks/VideoBlockItem';
import { Block } from '@/profile/blocks/types';

import { Empty } from './Empty';
import { SyncRSSButton } from './SyncRSSButton';

type Props = {
  isMyProfile: boolean;
  blocks: Block[] | null;
};

export const ProfileLinkSection: React.FC<Props> = ({
  isMyProfile,
  blocks,
}) => {
  const router = useRouter();
  const isSyncRSSButtonShown =
    !!isMyProfile && FeatureFlags.isProfileRSSSubscriptionEnabled;

  return (
    <ProfileLinkList>
      {isSyncRSSButtonShown && (
        <SyncRSSButton onClick={() => router.push('/profile/edit')} />
      )}

      {!!blocks ? (
        blocks.length > 0 ? (
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
          <Empty>No Links</Empty>
        )
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
