import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

export const Skeleton = styled.div`
  position: relative;
  background-color: #171717;
  background-image: linear-gradient(to right, #171717, #3b3b3b, #171717);
  background-repeat: no-repeat;
  background-size: 200% 100%;
  animation: 1s ease-in-out infinite forwards running ${shimmer};
`;
