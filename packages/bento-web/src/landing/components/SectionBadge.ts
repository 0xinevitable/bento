import styled from 'styled-components';

import { Badge } from '@/components/Badge';

export const SectionBadge = styled(Badge)`
  background-color: #1a1a1a;
  backdrop-filter: none;

  @media screen and (max-width: 600px) {
    font-size: 12px;
  }
`;
