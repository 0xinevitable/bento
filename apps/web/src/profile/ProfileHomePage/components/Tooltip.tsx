import styled from '@emotion/styled';
import React from 'react';
import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';
import { TooltipProps as RechartsTooltipProps } from 'recharts/types/component/Tooltip';

type TooltipContentProps = RechartsTooltipProps<ValueType, NameType> & {
  colors: string[];
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  payload,
  label,
  colors,
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      {payload?.map(({ name, value }, index) => (
        <Item key={index} style={{ color: colors?.[index] }}>
          {`${name}: ${(value ?? 0).toLocaleString()}`}
        </Item>
      ))}
    </Container>
  );
};

const Container = styled.div`
  padding: 12px;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.65);
  font-weight: bold;
  font-size: 14.5px;
`;

const Item = styled.span`
  font-weight: 500;
  font-size: 14px;

  &:not(:last-of-type) {
    margin-bottom: 6px;
  }
`;

export const tooltipWrapperStyle = {
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  borderRadius: 4,
  border: '1px solid rgba(255, 255, 255, 0.45)',
};
