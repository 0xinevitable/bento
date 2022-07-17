import React from 'react';
import styled from 'styled-components';

import { PLATFORM_LOGOS } from '@/dashboard/constants/platform';

type AssetRatioListItemProps = {
  platform: string;
  netWorth: number;
  name: string;
  ratio: number;
};

export const AssetRatioListItem: React.FC<AssetRatioListItemProps> = (
  props,
) => {
  return (
    <Container>
      <ProtocolHeader>
        <PlatformLogo
          src={PLATFORM_LOGOS[props.platform as keyof typeof PLATFORM_LOGOS]}
          alt={props.name}
        />
        <ProtocolName>{props.name}</ProtocolName>
      </ProtocolHeader>

      <Information>
        <ProtocolRatio>
          {`${props.ratio.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}

          <strong>{`$${props.netWorth.toLocaleString()}`}</strong>
        </ProtocolRatio>
      </Information>
    </Container>
  );
};
const Container = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ProtocolHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const PlatformLogo = styled.img`
  margin-right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  user-select: none;
`;
const ProtocolName = styled.label`
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  font-size: 14px;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const Information = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;
const ProtocolRatio = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);

  & > strong {
    margin-left: 6px;
    font-size: 15px;
    font-weight: 600;
    color: white;
  }

  &:not(:last-of-type) {
    margin-bottom: 6px;
  }
`;
