import styled from '@emotion/styled';
import React from 'react';

import { TextBlock } from '@/profile/blocks';

type Props = TextBlock & {};

export const TextBlockItem: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <Title>{props.title}</Title>
      {!!props.description && <Description>{props.description}</Description>}
    </Wrapper>
  );
};

const Wrapper = styled.li`
  margin: 32px 0;
  cursor: pointer;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: white;
  word-break: keep-all;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);
`;
