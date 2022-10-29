import { css } from '@emotion/react';
import styled from '@emotion/styled';

export const Icon = styled.span<{
  size: number;
  icon: string;
  color: string | undefined;
}>`
  display: flex;

  ${({ size }) => css`
    width: ${size}px;
    min-width: ${size}px;

    height: ${size}px;
    min-height: ${size}px;
  `};

  ${({ color, icon }) =>
    !color
      ? css`
          background-image: url('/assets/icons/${icon}.svg');
        `
      : !!icon &&
        css`
          mask-image: url('/assets/icons/${icon}.svg');
          mask-repeat: no-repeat;
          mask-size: contain;
          background-color: ${color};
        `};
`;
