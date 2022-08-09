import React from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';

import { ProfileLink } from '../../types/UserProfile';
import { ProfileLinkItem } from './ProfileLinkItem';

type Props = {
  items: ProfileLink[] | null;
  isEdit: Boolean;
};

export const ProfileLinkSection: React.FC<Props> = ({ items, isEdit }) => {
  return (
    <ProfileLinkList>
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
