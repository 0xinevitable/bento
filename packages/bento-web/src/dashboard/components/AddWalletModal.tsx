import { Wallet } from '@bento/common';
import clsx from 'clsx';
import produce from 'immer';
import React, { useCallback, useMemo, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';

import { Modal } from '@/components/Modal';
import { Portal } from '@/components/Portal';
import { WalletConnector } from '@/components/WalletConnector';
import { walletsAtom } from '@/recoil/wallets';

const CHAINS_BY_WALLET_TYPE = {
  evm: ['ethereum', 'polygon', 'klaytn'],
  'cosmos-sdk': ['cosmos', 'osmosis'],
  solana: [],
} as const;

type WalletDraft = {
  type: string;
  address: string;
  chains: string[];
};
const defaultWallet: WalletDraft = {
  type: '',
  address: '',
  chains: [],
};

const NETWORKS = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    logo: '/assets/ethereum.png',
  },
  {
    id: 'bsc',
    name: 'BSC',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png',
  },
  {
    id: 'polygon',
    name: 'Polygon',
    logo: '/assets/polygon.webp',
  },
  {
    id: 'klaytn',
    name: 'Klaytn',
    logo: 'https://avatars.githubusercontent.com/u/41137100?s=200&v=4',
  },
  {
    id: 'cosmos',
    name: 'Cosmos',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/cosmos/info/logo.png',
  },
  {
    id: 'osmosis',
    name: 'Osmosis',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/osmosis/info/logo.png',
  },
  {
    id: 'solana',
    name: 'Solana',
    logo: 'https://assets-cdn.trustwallet.com/blockchains/solana/info/logo.png',
  },
];

type AddWalletModalProps = {
  visible?: boolean;
  onDismiss?: () => void;
};

export const AddWalletModal: React.FC<AddWalletModalProps> = ({
  visible: isVisible,
  onDismiss,
}) => {
  const setWallets = useSetRecoilState(walletsAtom);
  const [draft, setDraft] = useState<WalletDraft>(defaultWallet);

  const handleChains = useCallback(
    (chainId: string) => {
      if (draft.type === 'solana') {
        return;
      }
      const previousChains: string[] = draft.chains;
      const chains = previousChains.includes(chainId)
        ? previousChains.filter((v) => v !== chainId)
        : [...previousChains, chainId];

      setDraft({ ...draft, chains });
    },
    [draft],
  );

  const handleSave = useCallback(() => {
    setWallets((prev) =>
      produce(prev, (walletsDraft) => {
        const index = walletsDraft.findIndex(
          (v) => v.address.toLowerCase() === draft.address.toLowerCase(),
        );
        if (index === -1) {
          walletsDraft.push(draft as Wallet);
        } else {
          // 이미 있는 지갑을 추가한 경우, 체인만 업데이트
          const wallet = walletsDraft[index];
          if (wallet.type === 'solana') {
            return;
          }
          wallet.chains = Array.from(
            new Set([...draft.chains, ...wallet.chains]),
          ) as any[];
        }
      }),
    );
    setDraft(defaultWallet);

    onDismiss();
  }, [draft, onDismiss]);

  const supportedChains = useMemo(() => {
    if (!draft.type) {
      return [];
    }
    const chains = CHAINS_BY_WALLET_TYPE[draft.type];
    return chains.length > 0 //
      ? chains
      : [];
  }, [draft.type]);

  return (
    <Portal>
      <OverlayWrapper
        visible={isVisible}
        onDismiss={onDismiss}
        transition={{ ease: 'linear' }}
      >
        <div
          className={clsx(
            'p-4 h-fit overflow-hidden',
            'border border-slate-800 rounded-md drop-shadow-2xl',
            'bg-slate-800/5 backdrop-blur-md flex flex-col cursor-pointer',
          )}
        >
          <section>
            <h3 className="mb-3 font-bold text-white">Choose Chains</h3>
            <div className="flex flex-wrap">
              {NETWORKS.map((network) => (
                <div
                  className="flex flex-col flex-1 items-center"
                  key={network.id}
                >
                  <img
                    className="w-12 h-12 rounded-full object-contain ring-1 ring-slate-100/25"
                    src={network.logo}
                    alt={network.name}
                  />
                  <span className="mt-1 text-white text-xs">
                    {network.name}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h3 className="mb-3 font-bold text-white">Sign with Wallet</h3>
            <WalletConnector onSave={onDismiss} />
          </section>
        </div>
      </OverlayWrapper>
    </Portal>
  );
};

const OverlayWrapper = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
