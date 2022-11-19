import styled from '@emotion/styled';
import { Input } from '@geist-ui/core';
import React from 'react';

export const SearchBar: React.FC = () => {
  return <StyledInput placeholder="Search Accounts" />;
};

const StyledInput = styled(Input)`
  width: 100%;
`;
