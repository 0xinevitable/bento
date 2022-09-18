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
  height: 322px;
  position: relative;
`;
const WalletItemList = styled.ul`
  padding-bottom: 88px;
  width: 100%;
  height: 322px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
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

const ButtonList = styled.div`
  margin-top: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const ShowAllButton = styled.button`
  padding: 8px 20px;
  background: #121a32;
  border: 1px solid #020322;
  border-radius: 8px;
  user-select: none;

  font-weight: 500;
  font-size: 12px;
  line-height: 100%;
  color: rgba(255, 255, 255, 0.65);

  &:not(:last-of-type) {
    margin-right: 8px;
  }

  &:active {
    opacity: 0.45;
  }
`;

const Button = styled.button`
  padding: 8px 20px;
  width: fit-content;
  cursor: pointer;
  user-select: none;

  border-radius: 8px;
  border: 1px solid rgba(255, 165, 165, 0.4);
  background: radial-gradient(98% 205% at 0% 0%, #74021a 0%, #c1124f 100%);
  filter: drop-shadow(0px 10px 32px rgba(151, 42, 53, 0.33));
  transition: all 0.2s ease-in-out;

  font-weight: 500;
  font-size: 12px;
  line-height: 100%;

  color: rgba(255, 255, 255, 0.92);
  text-shadow: 0px 4px 12px rgba(101, 0, 12, 0.42);

  &:active {
    opacity: 0.45;
  }
`;
