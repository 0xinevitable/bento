import styled from '@emotion/styled';
import { Input } from '@geist-ui/core';
import React from 'react';

export const SearchBar: React.FC = () => {
  return <StyledInput placeholder="GitHub" />;
};

const StyledInput = styled(Input)``;
