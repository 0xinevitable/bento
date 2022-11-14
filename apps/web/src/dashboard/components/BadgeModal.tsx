import styled from '@emotion/styled';
import React from 'react';

import { Modal } from '@/components/system';

import { Colors } from '@/styles';

import { KLAYswapBadge, SwapscannerBadge } from '../sections/Badges';

export type BadgeType = 'klayswap' | 'swapscanner';

type Props = {
  mode: BadgeType | null;
  achievements: string[];
  visible?: boolean;
  onDismiss?: () => void;
};

export const BadgeModal: React.FC<Props> = ({
  mode,
  achievements,
  visible: isVisible = false,
  onDismiss,
}) => {
  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      {mode === 'klayswap' && <KLAYswapBadge onClick={() => {}} />}
      {mode === 'swapscanner' && <SwapscannerBadge onClick={() => {}} />}

      {!!achievements && (
        <AchievementList>
          {achievements.map((item, index) => (
            <AchievementListItem key={index}>
              <Checkbox />
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </AchievementListItem>
          ))}
        </AchievementList>
      )}
    </OverlayWrapper>
  );
};

const OverlayWrapper = styled(Modal)`
  .modal-container {
    margin: 0 16px;
    padding: 24px 16px 16px;
    height: fit-content;
    overflow: hidden;
    width: 100%;
    max-width: 420px;

    max-height: calc(100vh - 64px - 84px);
    overflow: scroll;

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;

    border-radius: 32px;
    border: 1px solid ${Colors.gray600};
    box-shadow: 0 4px 24px ${Colors.black};
    background-color: ${Colors.gray800};
    cursor: pointer;
  }
`;

const AchievementList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 12px 24px;
  gap: 8px;
`;
const AchievementListItem = styled.li`
  color: #d9f15c;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  vertical-align: middle;
  -webkit-appearance: none;
  background: none;
  border: 0;
  outline: 0;
  flex-grow: 0;
  border-radius: 50%;
  background-color: #d9f15c;
  transition: background-color 300ms;
  cursor: pointer;

  &::before {
    content: '';
    color: transparent;
    display: block;
    width: inherit;
    height: inherit;
    border-radius: inherit;
    border: 0;
    background-color: transparent;
    background-size: contain;
  }

  &::before {
    box-shadow: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23black'/%3E %3C/svg%3E");
  }
`;
