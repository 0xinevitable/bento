import React from 'react';
import styled from 'styled-components';

type TooltipContentProps = {
  label: string;
  value: number;
  color: string;
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  label,
  value,
  color,
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Item style={{ color }}>
        {`${value.toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}%`}
      </Item>
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
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  borderRadius: 8,
  border: '1px solid rgba(255, 255, 255, 0.5)',
  zIndex: 30,
};
