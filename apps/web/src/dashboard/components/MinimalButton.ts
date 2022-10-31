import styled from '@emotion/styled';

import { Button } from '@/components/system';

import { Colors } from '@/styles';

export const MinimalButton = styled(Button)`
  margin: 8px auto 0;
  width: fit-content;
  height: unset;
  padding: 12px 18px;

  font-weight: 800;
  font-size: 14px;
  line-height: 100%;
  text-align: center;
  color: ${Colors.white};
`;
