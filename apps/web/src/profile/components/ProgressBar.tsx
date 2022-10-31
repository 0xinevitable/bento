import styled from '@emotion/styled';
import React from 'react';

type Props = {
  percentage: number;
};

export const ProgressBar: React.FC<Props> = ({ percentage }) => {
  return (
    <Container>
      <Bar percentage={percentage} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  background-color: rgba(255, 255, 255, 0.18);
  height: 8px;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
`;

type BarProps = {
  percentage: number;
};
const Bar = styled.div<BarProps>`
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${({ percentage }) => (percentage < 5 ? 5 : percentage)}%;
  background-image: linear-gradient(to right, #0038ff, #6be7e2);
  transition: width 0.4s ease-in-out;
  border-radius: 4px;
`;
