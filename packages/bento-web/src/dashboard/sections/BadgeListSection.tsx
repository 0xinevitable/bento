import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/future/image';
import { useCallback, useState } from 'react';
import styled from 'styled-components';

import ogBadgeIllust1 from '@/assets/badges/og-1.png';
import ogBadgeIllust2 from '@/assets/badges/og-2.png';
import { debounce } from '@/utils/debounce';

import { Colors, float } from '@/styles';

export const BadgeListSection: React.FC = () => {
  const [isHovered, setHovered] = useState<boolean>(false);

  const onMouseEnter = useCallback(
    debounce(() => setHovered(true), 100),
    [],
  );
  const onMouseLeave = useCallback(
    debounce(() => setHovered(false), 100),
    [],
  );

  return (
    <Section>
      <ul>
        <BadgeItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <AnimatePresence>
            <div
              style={{
                display: 'flex',
                width: '100%',
                height: '100%',
                ...(isHovered
                  ? {
                      position: 'relative',
                      overflow: 'hidden',
                    }
                  : undefined),
              }}
            >
              <motion.div {...float(4, false, 1.5)}>
                <Image
                  className="img-1"
                  alt="2020 OG Early Bento"
                  src={ogBadgeIllust1}
                  width={227.79}
                  height={275.25}
                  style={{
                    position: 'absolute',
                    top: 4.5,
                    left: 6,
                    pointerEvents: 'none',
                  }}
                />
              </motion.div>
            </div>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <BadgeBackground />
                <motion.div
                  {...float(4, false, 1.5)}
                  style={{ width: '100%', position: 'absolute', left: 0 }}
                >
                  <Image
                    className="img-2"
                    alt="2020 OG Early Bento"
                    src={ogBadgeIllust2}
                    width={209.47}
                    height={260.25}
                    style={{
                      position: 'absolute',
                      top: 13.5,
                      left: 15,
                      pointerEvents: 'none',
                    }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </BadgeItem>
      </ul>
    </Section>
  );
};

const Section = styled.section`
  &,
  ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
`;

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
