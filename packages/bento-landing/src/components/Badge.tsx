import styled from 'styled-components';

import { onMobile } from '@/landing/utils/breakpoints';
import { systemFontStack } from '@/styles/fonts';

export const Badge = styled.span.attrs({
  className: 'badge',
})`
  padding: 8px 9px;
  width: fit-content;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  border-radius: 4px;

  font-family: ${systemFontStack};
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  text-align: center;

  color: rgba(255, 255, 255, 0.8);

  ${onMobile} {
    font-size: 14px;
  }
`;
