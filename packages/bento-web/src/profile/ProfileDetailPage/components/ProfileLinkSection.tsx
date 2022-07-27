import React from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';

import { ProfileLink } from '../../types/UserProfile';
import { ProfileLinkItem } from './ProfileLinkItem';

type Props = {
  items: ProfileLink[] | null;
};

export const ProfileLinkSection: React.FC<Props> = ({ items }) => {
  return (
    <ProfileLinkList>
      {!!items ? (
        items?.map((item, index) => {
          return <ProfileLinkItem key={`item-${index}`} {...item} />;
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
  width: 536px;
  height: 110px;
  margin-top: 8px;
  border-radius: 8px;
  align-self: center;
`;
