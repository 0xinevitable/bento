import styled from '@emotion/styled';
import { motion } from 'framer-motion';

const COLORS = ['#000', '#21040c', '#0a1924', '#262a31'];
const GRADIENT_URL = `https://gradientgen.vercel.app?colors=${COLORS.map((v) =>
  v.replace('#', ''),
).join(',')}`;

export const Gradient: React.FC = () => {
  return (
    <GradientWrapper>
      <motion.iframe
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        src={GRADIENT_URL}
        style={{ border: 'none', overflow: 'hidden' }}
      />
    </GradientWrapper>
  );
};

const GradientWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  &,
  * {
    user-select: none;
    -webkit-user-drag: none;
  }

  &,
  & > iframe {
    width: 100%;
    height: 100vh;
  }
`;
