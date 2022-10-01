import { MotionProps } from 'framer-motion';

export const float = (y: number, reverse: boolean = false): MotionProps => ({
  initial: { transform: `translate3d(0, ${!reverse ? -y : y}px, 0)` },
  animate: { transform: `translate3d(0, ${!reverse ? y : -y}px, 0)` },
  transition: {
    ease: 'linear',
    repeat: Infinity,
    repeatType: 'mirror',
    duration: 2,
  },
});
