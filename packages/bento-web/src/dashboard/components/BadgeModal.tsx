import { Wallet } from '@bento/common';
import React, { useCallback, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';

import { WalletConnector } from '@/components/WalletConnector';
import { Modal } from '@/components/system';
import { useSession } from '@/hooks/useSession';

import { NETWORKS, Network } from '@/constants/networks';
import { Colors } from '@/styles';
import { Analytics } from '@/utils';

import { KLAYswapBadge, SwapscannerBadge } from '../sections/Badges';

type AddWalletModalProps = {
  mode: 'ksp' | 'scnr' | null;
  visible?: boolean;
  onDismiss?: () => void;
};

export const BadgeModal: React.FC<AddWalletModalProps> = ({
  mode,
  visible: isVisible = false,
  onDismiss,
}) => {
  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      {mode === 'ksp' && <KLAYswapBadge onClick={() => {}} />}
      {mode === 'scnr' && <SwapscannerBadge onClick={() => {}} />}

      {mode === 'ksp' && (
        <ListList>
          <ListItem>
            <Checkbox />
            Staked more than <strong>3+ LPs</strong>
          </ListItem>
        </ListList>
      )}
      {mode === 'scnr' && (
        <ListList>
          <ListItem>
            <Checkbox />
            Participated in <strong>1st Revenue Sharing</strong>
          </ListItem>
          <ListItem>
            <Checkbox />
            Single-staked more than <strong>10,000 SCNR</strong>
          </ListItem>
        </ListList>
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

const ListList = styled.ul`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 12px 24px;
  gap: 8px;
`;
const ListItem = styled.li`
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
