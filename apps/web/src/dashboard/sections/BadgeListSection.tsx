import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import ogBadgeIllust1 from '@/assets/badges/og-1.png';
import ogBadgeIllust2 from '@/assets/badges/og-2.png';
import { debounce } from '@/utils/debounce';

import { Colors, float } from '@/styles';
import { FeatureFlags, axiosWithCredentials, toast } from '@/utils';

import { BadgeModal, BadgeType } from '../components/BadgeModal';
import { KLAYswapBadge, SwapscannerBadge } from './Badges';

type Badge = {
  type: BadgeType;
  achievements: string[];
};

type Props = {
  userId: string;
  selected: boolean;
};

export const BadgeListSection: React.FC<Props> = ({ userId, selected }) => {
  const [isHovered, setHovered] = useState<boolean>(false);
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    if (selected && !!userId) {
      axiosWithCredentials
        .get(`/api/profile/badges/${userId}`)
        .then(({ data }) => {
          if (Array.isArray(data)) {
            setBadges(data);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [userId, selected]);

  const onMouseEnter = useCallback(
    debounce(() => setHovered(true), 100),
    [],
  );
  const onMouseLeave = useCallback(
    debounce(() => setHovered(false), 100),
    [],
  );

  const [badgeModalVisible, setBadgeModalVisible] = useState<BadgeType | null>(
    null,
  );
  const [badgeAchievements, setBadgeAchievements] = useState<string[]>([]);

  return (
    <Section>
      <ul>
        <BadgeItem
          onClick={() =>
            toast({
              type: 'info',
              title: 'Coming Soon!',
            })
          }
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
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
              <motion.div {...float(4, false, 1.5)} key="og-1-float">
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
                key="animated-opacity"
              >
                <BadgeBackground />
                <motion.div
                  {...float(4, false, 1.5)}
                  style={{ width: '100%', position: 'absolute', left: 0 }}
                  key="og-2-float"
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
        {FeatureFlags.isBadgeMockupsEnabled && (
          <>
            {badges.map((badge, index) => {
              if (badge.type === 'klayswap') {
                return (
                  <KLAYswapBadge
                    key={index}
                    onClick={() => {
                      setBadgeModalVisible(badge.type);
                      setBadgeAchievements(badge.achievements);
                    }}
                  />
                );
              }
              if (badge.type === 'swapscanner') {
                return (
                  <SwapscannerBadge
                    key={index}
                    onClick={() => {
                      setBadgeModalVisible(badge.type);
                      setBadgeAchievements(badge.achievements);
                    }}
                  />
                );
              }
              return null;
            })}
          </>
        )}
      </ul>

      <BadgeModal
        mode={badgeModalVisible}
        visible={!!badgeModalVisible}
        achievements={badgeAchievements}
        onDismiss={() => {
          setBadgeModalVisible(null);
          setBadgeAchievements([]);
        }}
      />
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

  ul {
    gap: 16px;
    user-select: none;
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
