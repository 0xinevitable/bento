import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

import { Modal } from '@/components/Modal';
import { Portal } from '@/components/Portal';

import { WalletBalance } from '../types/balance';

export type TokenDetailModalParams = {
  tokenBalance?: {
    symbol: string;
    name: string;
    logo?: string;
    tokenAddress?: string;
    balances: WalletBalance[];
    netWorth: number;
    amount: number;
    price: number;
    type?: 'nft';
  };
};
type Props = TokenDetailModalParams & {
  visible?: boolean;
  onDismiss?: () => void;
};

export const TokenDetailModal: React.FC<Props> = ({
  visible: isVisible = false,
  onDismiss,
  tokenBalance,
}) => {
  return (
    <Portal>
      <OverlayWrapper
        visible={isVisible}
        onDismiss={onDismiss}
        transition={{ ease: 'linear' }}
      >
        {!tokenBalance ? null : (
          <div
            className={clsx(
              'p-4 h-fit overflow-hidden',
              'flex flex-col gap-8',
              'border border-slate-800 rounded-md drop-shadow-2xl',
              'bg-slate-800/5 backdrop-blur-md flex flex-col cursor-pointer',
            )}
          >
            <img src={tokenBalance.logo} />
          </div>
        )}
      </OverlayWrapper>
    </Portal>
  );
};

const OverlayWrapper = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;

  &,
  & > * {
    user-select: none;
  }
`;
