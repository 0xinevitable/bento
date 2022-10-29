import styled from '@emotion/styled';
import { useNProgress } from '@tanem/react-nprogress';

import { Colors } from '@/styles';

type LoadingProgressProps = {
  isRouteChanging: boolean;
};

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  isRouteChanging,
}) => {
  const props = useNProgress({
    isAnimating: isRouteChanging,
  });

  return (
    <Container {...props}>
      <div />
    </Container>
  );
};

const Container = styled.div<{
  isFinished: boolean;
  animationDuration: number;
  progress: number;
}>`
  opacity: ${({ isFinished }) => (isFinished ? 0 : 1)};
  pointer-events: none;
  transition: opacity ${({ animationDuration }) => animationDuration}ms linear;

  /* bar */
  & > div {
    margin-left: ${({ progress }) => (-1 + progress) * 100}%;
    width: 100%;
    height: 2px;

    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;

    background: ${Colors.brand500};
    transition: margin-left ${({ animationDuration }) => animationDuration}ms
      linear;
  }
`;
