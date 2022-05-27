import React from 'react';
import styled from 'styled-components';

import { ProfileLink } from '../../types/UserProfile';

import { ProfileLinkItem } from './ProfileLinkItem';

type Props = {
  items: ProfileLink[];
};

export const ProfileLinkSection: React.FC<Props> = ({ items }) => {
  return (
    <ProfileLinkList>
      {items.map((item, index) => {
        return <ProfileLinkItem key={`item-${index}`} {...item} />;
      })}
    </ProfileLinkList>
  );
};

const ProfileLinkList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;
