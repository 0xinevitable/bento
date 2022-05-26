import { Wallet, WALLET_TYPES } from '@bento/core/lib/types';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import clsx from 'clsx';
import produce from 'immer';

import { walletsAtom } from '@/recoil/wallets';

const CHAINS_BY_WALLET_TYPE = {
  evm: ['ethereum', 'polygon', 'klaytn'],
  tendermint: ['cosmos', 'osmosis'],
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

export const AppendWallet: React.FC = () => {
  const [wallets, setWallets] = useRecoilState(walletsAtom);
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
    // 이미 있는 지갑을 추가한 경우, 체인만 업데이트
    const duplicatedWallet = wallets.find((v) => v.address === draft.address);
    if (duplicatedWallet) {
      setWallets((prev) =>
        produce(prev, (walletsDraft) => {
          walletsDraft.forEach((wallet) => {
            if (wallet.address === draft.address && wallet.type !== 'solana') {
              wallet.chains = Array.from(
                new Set([...(draft.chains as any), ...wallet.chains]),
              );
            }
          });
        }),
      );
      setDraft(defaultWallet);
      return;
    }

    setWallets((prev) => [...prev, draft as Wallet]);
    setDraft(defaultWallet);
  }, [draft]);

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
    <div
      className={clsx(
        'mt-6 mb-2 p-4 h-fit overflow-hidden',
        'border border-slate-700 rounded-md drop-shadow-2xl',
        'bg-slate-800/25 backdrop-blur-md flex flex-col cursor-pointer',
      )}
    >
      <div className="flex flex-col h-auto text-slate-50/90">
        <div>
          {WALLET_TYPES.map((walletType: string) => (
            <span key={walletType}>
              <button
                className={clsx(
                  'p-1 px-2 rounded-md border',
                  draft.type === walletType
                    ? 'border-white'
                    : 'border-transparent',
                )}
                type="button"
                onClick={() => setDraft({ ...draft, type: walletType })}
              >
                {walletType.toUpperCase()}
              </button>
            </span>
          ))}
        </div>
        <div className="mt-2">
          <input
            type="text"
            className="w-full p-3 px-4 rounded-md bg-slate-800"
            name="Address"
            placeholder="Address"
            value={draft.address}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDraft({ ...draft, address: event.target.value })
            }
          />
        </div>
        {draft.type !== 'solana' && (
          <div>
            {supportedChains.map((chainId: string) => (
              <span key={chainId}>
                <button
                  className={clsx(
                    'p-1 px-2 rounded-md border',
                    draft.chains.includes(chainId)
                      ? 'border-white'
                      : 'border-transparent',
                  )}
                  type="button"
                  onClick={() => handleChains(chainId)}
                >
                  {chainId.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
        )}
        <button
          className="mt-2 p-2 px-4 w-fit font-bold text-slate-800 bg-slate-200 rounded-md"
          type="button"
          onClick={handleSave}
        >
          Add Wallet
        </button>
      </div>
    </div>
  );
};

const saveWalletsInfo = (wallet: Wallet) => {
  let walletList = getWalletsInfo();
  walletList.push(wallet);
  localStorage.setItem('wallet', JSON.stringify({ ...walletList }));
};

const getWalletsInfo = (): Wallet[] =>
  Object.values(JSON.parse(localStorage.getItem('wallet') ?? '{}'));
