import dedent from 'dedent';
import React from 'react';
import styled from 'styled-components';

import { inputStyle } from '@/profile/components/FieldInput';
import { UserProfile } from '@/profile/types/UserProfile';

import { usePalette } from '../hooks/usePalette';
import { ProfileEditButton } from './ProfileEditButton';

type Props = {
  profile: UserProfile;
};

export const ProfileEditor: React.FC<Props> = ({ profile }) => {
  return <></>;
};

const DisplayName = styled.h1`
  margin: 0;
  font-weight: 900;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  color: #ffffff;
`;

const Input = styled.input`
  ${inputStyle}
`;
