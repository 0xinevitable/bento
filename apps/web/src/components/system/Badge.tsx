import styled from '@emotion/styled';

import { withAttrs } from '@/utils/withAttrs';

export const Badge = withAttrs(
  { className: 'badge' },
  styled.span`
    padding: 8px 9px;
    width: fit-content;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(12px);
    border-radius: 4px;

    font-weight: 500;
    font-size: 16px;
    line-height: 100%;
    text-align: center;

    color: rgba(255, 255, 255, 0.8);
  `,
);
