import styled from '@emotion/styled';

import { Colors } from '@/styles';

export const Button = styled.button`
  height: 62px;
  padding: 0 26px;
  background: ${Colors.brandgradient};
  box-shadow: 0px 4px 16px rgba(255, 119, 184, 0.44);
  border-radius: 8px;

  font-weight: bold;
  font-size: 18px;
  line-height: 100%;
  text-align: center;

  color: #0a0509;
  transition: all 0.2s ease-in-out;

  &:hover {
    filter: brightness(1.1);
    box-shadow: 0px 4px 24px rgba(255, 119, 184, 0.55);
  }

  &:focus {
    filter: opacity(0.66);
  }

  &.yellow {
    background: linear-gradient(155.97deg, #ffd978 15.42%, #d09600 102.91%);
    box-shadow: 0px 3.13px 12.53px rgba(250, 209, 105, 0.3);
    color: #000000;

    &:hover {
      box-shadow: 0px 4px 24px rgba(250, 209, 105, 0.55);
    }
  }
`;
