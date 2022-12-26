import { HTMLMotionProps, motion } from 'framer-motion';

type AnimatedTabProps = {
  selected: boolean;
};
export const AnimatedTab = (
  props: AnimatedTabProps & HTMLMotionProps<'div'>,
) => (
  <motion.div
    initial={false}
    animate={
      !props.selected
        ? { opacity: 0, transform: 'scale(0.9)' }
        : { opacity: 1, transform: 'scale(1)' }
    }
    style={{
      originY: 0,
      display: !props.selected ? 'none' : 'flex',
      flexDirection: 'column',
      ...props.style,
    }}
    transition={{ duration: 0.35 }}
    {...props}
  />
);
