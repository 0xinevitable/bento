import styled from 'styled-components';

import { systemFontStack } from '@/styles/fonts';

export const Badge = styled.span`
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
`;
