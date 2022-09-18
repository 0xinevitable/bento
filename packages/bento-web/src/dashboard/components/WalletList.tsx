import { NETWORKS } from '@bento/client/constants/networks';
import { useRevalidateWallets } from '@bento/client/hooks/useWallets';
import { Colors } from '@bento/client/styles/colors';
import { Analytics } from '@bento/client/utils/analytics';
import { copyToClipboard } from '@bento/client/utils/clipboard';
import { toast } from '@bento/client/utils/toast';
import {
  CosmosSDKBasedNetworks,
  EVMBasedNetworks,
  WALLET_TYPES,
  Wallet,
} from '@bento/common';
import { shortenAddress } from '@bento/common';
import { Icon } from '@iconify/react';
import axios from 'axios';
import clsx from 'clsx';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { WalletListItem } from './WalletListItem';

type WalletListProps = {
  className?: string;
  wallets: Wallet[];
  onClickConnect?: () => void;
};

export const WalletList: React.FC<WalletListProps> = ({
  className,
  wallets,
  onClickConnect,
}) => {
  const onClickCopy = useCallback(
    (walletAddress: string, walletType: 'evm' | 'cosmos-sdk' | 'solana') => {
      Analytics.logEvent('click_copy_wallet_address', {
        type: walletType,
        address: walletAddress,
      });
      copyToClipboard(walletAddress);
      toast({
        title: 'Copied to clipboard!',
        description: walletAddress,
      });
    },
    [],
  );

  return (
    <Container>
      <WalletItemList>
        {wallets.map((wallet) => (
          <WalletListItem
            key={wallet.address}
            {...wallet}
            onClickCopy={onClickCopy}
          />
        ))}
      </WalletItemList>
      <Footer>
        <div />
        <div>
          <span>
            Wallets Connected <span className="total">{wallets.length}</span>
          </span>
        </div>
      </Footer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  position: relative;
  margin-top: -40px;
`;
const WalletItemList = styled.ul`
  padding-top: 40px;
  padding-bottom: ${(88 * 2) / 3}px;
  width: 100%;
  max-height: 322px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 86px;

  display: flex;
  flex-direction: column;

  & > div:first-of-type {
    width: 100%;
    height: 64px;

    background: linear-gradient(
      to bottom,
      transparent 22%,
      ${Colors.black} 97%
    );
  }

  & > div:last-of-type {
    background-color: ${Colors.black};
    flex: 1;

    display: flex;
    justify-content: center;

    span {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 18px;
      line-height: 100%;
      text-align: center;
      letter-spacing: -0.05em;
      color: #ffffff;

      &.total {
        color: ${Colors.brand400};
      }
    }
  }
`;
