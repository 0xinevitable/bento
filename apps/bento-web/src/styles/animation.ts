import { MotionProps } from 'framer-motion';

export const float = (
  y: number,
  reverse: boolean = false,
  duration: number = 2,
): MotionProps => ({
  initial: { transform: `translate3d(0, ${!reverse ? -y : y}px, 0)` },
  animate: { transform: `translate3d(0, ${!reverse ? y : -y}px, 0)` },
  transition: {
    ease: 'easeInOut',
    repeat: Infinity,
    repeatType: 'mirror',
    duration,
  },
});
