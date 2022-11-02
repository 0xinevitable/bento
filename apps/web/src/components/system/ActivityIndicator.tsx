import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

type Props = {
  color?: string;
  borderSize: number;
  size: number;
};

export const ActivityIndicator = styled.div<Props>`
  display: inline-block;
  border-radius: 50%;
  border-style: solid;
  border-bottom-color: transparent;
  border-left-color: transparent;
  animation: ${rotate} linear infinite 0.75s;

  ${({ color = 'rgba(255, 255, 255, 0.85)', borderSize, size }) => css`
    color: ${color};
    border-top-color: ${color};
    border-right-color: ${color};

    width: ${size}px;
    height: ${size}px;

    border-width: ${borderSize}px;
  `}
`;
