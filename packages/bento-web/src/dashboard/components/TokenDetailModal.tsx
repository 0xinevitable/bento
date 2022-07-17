import clsx from 'clsx';
import React from 'react';
import styled from 'styled-components';

import { Modal } from '@/components/Modal';
import { Portal } from '@/components/Portal';

import { WalletBalance } from '../types/balance';

export type TokenDetailModalParams = {
  tokenBalance?: {
    symbol: string | null;
    name: string;
    logo?: string;
    tokenAddress?: string;
    balances: WalletBalance[];
    netWorth: number;
    amount: number;
    price: number;
    type?: 'nft';

    // TODO: Add proper types
    assets?: any[];
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
          <Content>
            <TokenHeader>
              <TokenImage src={tokenBalance.logo} />
              <TokenInformation>
                <TokenName>{tokenBalance.name}</TokenName>
                {tokenBalance.symbol !== null && (
                  <TokenSymbol className="text-gray-400">
                    {`$${tokenBalance.symbol}`}
                  </TokenSymbol>
                )}
              </TokenInformation>
            </TokenHeader>
          </Content>
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
const Content = styled.div`
  padding: 16px;
  max-width: 800px;
  width: 95vw;

  display: flex;
  flex-direction: column;

  border: 1px solid #323232;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.45);
`;
const TokenHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TokenImage = styled.img`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;
`;

const TokenInformation = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`;
const TokenName = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: white;
`;
const TokenSymbol = styled.span``;
