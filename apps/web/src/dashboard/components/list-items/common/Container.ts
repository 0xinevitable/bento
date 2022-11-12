import styled from '@emotion/styled';

import { Breakpoints } from '@/dashboard/constants/breakpoints';
import { Colors } from '@/styles';

export const Container = styled.li`
  width: calc((100% - 8px) / 3);
  height: fit-content;
  padding: 10px;

  background: ${Colors.gray900};
  border: 1px solid ${Colors.gray800};
  border-radius: 8px;

  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease-in-out, border 0.2s ease-in-out;

  img {
    user-select: none;
  }

  div.info {
    margin-left: 8px;
    min-width: 0;

    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  span.name-row {
    display: flex;
    align-items: center;

    font-size: 16px;
    font-weight: 600;
    line-height: 1;
    color: ${Colors.gray400};
  }

  span.valuation {
    font-size: 22px;
    line-height: 28px;
    font-weight: bold;
    color: ${Colors.gray050};
  }

  &:hover {
    background: ${Colors.gray800};
    border: 1px solid ${Colors.gray700};
  }

  @media (max-width: ${Breakpoints.Tablet}px) {
    width: calc((100% - 4px) / 2);
  }

  @media (max-width: ${Breakpoints.Mobile}px) {
    width: 100%;

    span.name-row {
      font-size: 14px;
    }

    span.valuation {
      font-size: 18px;
      line-height: 20px;
    }
  }
`;
