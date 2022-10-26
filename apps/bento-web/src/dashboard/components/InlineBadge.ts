import styled from 'styled-components';

import { Badge } from '@/components/system';

export const InlineBadge = styled(Badge)`
  && {
    margin-left: 8px;
    padding: 6px;
    display: inline-flex;
    font-size: 13px;
    backdrop-filter: none;
  }
`;
