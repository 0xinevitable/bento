import { ChainType, Wallet } from '@bento/common';
import styled from '@emotion/styled';
import clsx from 'clsx';
import { useTranslation } from 'next-i18next';
import React, { useCallback, useMemo } from 'react';

import { Analytics, copyToClipboard, toast } from '@/utils';

import { Empty } from './Empty';
import { WalletListItem } from './ProfileWalletItem';

const SORTED_ORDER: ChainType[] = ['cosmos-sdk', 'sealevel', 'evm'];

type ProfileWalletListProps = {
  wallets: Wallet[];
};

export const ProfileWalletList: React.FC<ProfileWalletListProps> = ({
  wallets,
}) => {
  const { t } = useTranslation('dashboard');

  const onClickCopy = useCallback((account: string, walletType: ChainType) => {
    Analytics.logEvent('click_copy_wallet_address', {
      type: walletType,
      address: account,
    });
    copyToClipboard(account);
    toast({
      title: 'Copied to clipboard!',
      description: account,
    });
  }, []);

  const sortedWallets = useMemo(() => {
    return [...wallets].sort((a, b) => {
      if (a.type === b.type) {
        return b.address.localeCompare(a.address);
      }
      return SORTED_ORDER.indexOf(a.type) - SORTED_ORDER.indexOf(b.type);
    });
  }, [wallets]);

  return (
    <React.Fragment>
      {sortedWallets.length > 0 ? (
        <WalletItemList>
          {sortedWallets.map((wallet, index) => (
            <WalletListItem key={index} {...wallet} onClickCopy={onClickCopy} />
          ))}
        </WalletItemList>
      ) : (
        <Empty>{t('No Wallets Found')}</Empty>
      )}
    </React.Fragment>
  );
};

const WalletItemList = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
