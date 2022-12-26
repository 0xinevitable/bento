import { BadgeProps, Badge as GeistBadge } from '@geist-ui/core';

import { Colors } from '@/styles';

export const Badge: React.FC<BadgeProps> = ({ style, ...props }) => (
  <GeistBadge
    scale={0.7}
    type="secondary"
    style={{
      display: 'flex',
      marginLeft: 5,
      gap: 2,
      backgroundColor: Colors.gray600,
      ...style,
    }}
    {...props}
  />
);
