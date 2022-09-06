import { WALLET_TYPES, Wallet } from '@bento/common';
import { shortenAddress } from '@bento/common';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import { Analytics } from '@/utils/analytics';
import { copyToClipboard } from '@/utils/clipboard';
import { toast } from '@/utils/toast';

import { NETWORKS, Network } from '@/dashboard/components/AddWalletModal';

const SORTED_ORDER = ['cosmos-sdk', 'solana', 'evm'];

type ProfileWalletListProps = {
  className?: string;
  wallets: Wallet[];
};

export const ProfileWalletList: React.FC<ProfileWalletListProps> = ({
  className,
  wallets,
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
      <ul className={clsx('flex flex-col gap-6', className)}>
        {sortedWallets.map((wallet, index) => (
          <li className="py-2 flex" key={index}>
            <img
              className="w-[64px] min-w-[64px] h-[64px] rounded-full overflow-hidden shadow-md ring-1 ring-slate-100/25 select-none"
              src={WALLET_TYPES[wallet.type].logo}
            />
            <div className="ml-2 flex flex-col flex-1 gap-1">
              <div className="flex items-center">
                <span className="text-white/60 text-xl">
                  {shortenAddress(wallet.address)}
                </span>
                <button
                  className="ml-1 text-white focus:opacity-40"
                  onClick={() => onClickCopy(wallet.address, wallet.type)}
                >
                  <Icon icon="eva:copy-fill" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {(wallet.type !== 'solana' ? wallet.networks : ['solana']).map(
                  (network) => {
                    const networkMeta = NETWORKS.find((v) => v.id === network);
                    if (!networkMeta) {
                      return null;
                    }
                    return (
                      <NetworkBadge key={networkMeta.id} {...networkMeta} />
                    );
                  },
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};

const NetworkBadge: React.FC<Network> = (props) => {
  return (
    <NetworkBadgeContainer>
      <NetworkImage alt={props.name} src={props.logo} />
      {props.name}
    </NetworkBadgeContainer>
  );
};
const NetworkBadgeContainer = styled.span`
  padding: 4px;
  padding-right: 8px;
  border-radius: 32px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 14px;
  line-height: 1;
  gap: 6px;

  color: rgb(241 245 249 / 0.6);

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
`;
const NetworkImage = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 50%;
`;
