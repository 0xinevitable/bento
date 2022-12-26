import styled from '@emotion/styled';
import React from 'react';

type TooltipContentProps = {
  label: string;
  value: number;
  logo?: string;
};

export const TooltipContent: React.FC<TooltipContentProps> = ({
  label,
  value,
  logo,
}) => {
  return (
    <Container>
      {!!logo && <Logo src={logo} alt={label} />}

      <Information>
        <ProtocolName>{label}</ProtocolName>
        <ProtocolRatio>
          {`${value.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}
        </ProtocolRatio>
      </Information>
    </Container>
  );
};

const Container = styled.div`
  padding: 12px;
  display: flex;
  align-items: center;
  width: max-content;

  * {
    user-select: none;
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

const Information = styled.div`
  margin-left: 8px;
  display: flex;
  flex-direction: column;
`;
const ProtocolName = styled.label`
  color: rgba(255, 255, 255, 0.65);
  font-weight: 500;
  font-size: 18px;
`;
const ProtocolRatio = styled.span`
  font-weight: bold;
  font-size: 16px;
  color: white;

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
