import styled from '@emotion/styled';

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

  @media (max-width: 1100px) {
    width: calc((100% - 4px) / 2);
  }

  @media (max-width: 880px) {
    width: calc((100% - 8px) / 3);
  }

  @media (max-width: 720px) {
    width: calc((100% - 8px) / 2);
  }

  @media (max-width: 540px) {
    width: 100%;
  }

  img {
    user-select: none;
  }

  transition: background 0.2s ease-in-out, border 0.2s ease-in-out;

  &:hover {
    background: ${Colors.gray800};
    border: 1px solid ${Colors.gray700};
  }
`;
