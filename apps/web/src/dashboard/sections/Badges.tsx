import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Image from 'next/image';

import klayswapIllust from '@/assets/badges/klayswap.png';
import swapscannerIllust from '@/assets/badges/swapscanner.png';

import { Colors, float } from '@/styles';

type Props = {
  onClick: () => void;
};

export const KLAYswapBadge: React.FC<Props> = ({ onClick }) => {
  return (
    <BadgeItem className="klayswap" onClick={onClick}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          // ...(isHovered
          //   ? {
          //       position: 'relative',
          //       overflow: 'hidden',
          //     }
          //   : undefined),
        }}
      >
        <motion.div {...float(6, true, 1.8)}>
          <Image
            alt="KLAYswap"
            src={klayswapIllust}
            width={274.89}
            height={238.74}
            style={{
              position: 'absolute',
              top: 1.5,
              left: -24,
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>
    </BadgeItem>
  );
};
export const SwapscannerBadge: React.FC<Props> = ({ onClick }) => {
  return (
    <BadgeItem className="swapscanner" onClick={onClick}>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          // ...(isHovered
          //   ? {
          //       position: 'relative',
          //       overflow: 'hidden',
          //     }
          //   : undefined),
        }}
      >
        <motion.div {...float(6, false, 1.8)} key="og-1-float">
          <Image
            className="img-1"
            alt="Swapscanner"
            src={swapscannerIllust}
            width={274.89}
            height={238.74}
            style={{
              position: 'absolute',
              top: 1.5,
              left: -24,
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>
    </BadgeItem>
  );
};

const BadgeItem = styled.li`
  position: relative;
  display: flex;
  width: 240px;
  height: 240px;
  cursor: pointer;

  background: ${Colors.gray800};
  border-radius: 24px;
  filter: saturate(120%);

  @media screen and (max-width: 526px) {
    width: 160px;
    height: 160px;

    .img-1 {
      width: 151.86px;
      height: 183.5px;
    }

    .img-2 {
      width: 139.65px;
      height: 173.5px;
    }
  }

  &.klayswap {
    background: linear-gradient(180deg, #ff813a 0%, #b91d1e 100%, #ff0608 100%);
  }

  &.swapscanner {
    background: linear-gradient(180deg, #00edd6 0%, #0c5a50 100%);
  }
`;
const BadgeBackground = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: ${Colors.black};
  background-image: url('/assets/badges/og-badge-background.png');
  background-size: cover;
  border-radius: 24px;
`;
