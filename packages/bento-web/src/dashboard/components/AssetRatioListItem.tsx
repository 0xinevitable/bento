import React from 'react';
import styled from 'styled-components';

import { PLATFORM_LOGOS } from '../constants/platform';

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
      <PlatformLogo
        src={PLATFORM_LOGOS[props.platform as keyof typeof PLATFORM_LOGOS]}
        alt={props.name}
      />

      <Information>
        <ProtocolName>{props.name}</ProtocolName>

        <ProtocolRatio>
          <strong>{`$${props.netWorth.toLocaleString()}`}</strong>

          {`${props.ratio.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}
        </ProtocolRatio>
      </Information>
    </Container>
  );
};
const Container = styled.li`
  display: flex;
  align-items: center;
`;

const PlatformLogo = styled.img`
  margin-right: 8px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
`;
const Information = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProtocolName = styled.label`
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  font-size: 14px;
`;
const ProtocolRatio = styled.span`
  font-weight: 500;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.65);

  & > strong {
    margin-right: 6px;
    font-size: 15px;
    font-weight: 600;
    color: white;
  }

  &:not(:last-of-type) {
    margin-bottom: 6px;
  }
`;
