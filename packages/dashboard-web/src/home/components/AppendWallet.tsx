import { Wallet, WALLET_TYPES } from '@dashboard/core/lib/config';
import React, { useCallback, useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import clsx from 'clsx';

import { walletsAtom } from '@/recoil/wallets';

const CHAINS_BY_WALLET_TYPE = {
  erc: ['ethereum', 'polygon', 'klaytn'],
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

  const handleType = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setDraft({ ...draft, type: event.target.value }),
    [],
  );

  const handleChains = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (draft.type === 'solana') {
        return;
      }
      const chainId = event.target.value;
      const previousChains: string[] = draft.chains;
      const chains = previousChains.includes(chainId)
        ? previousChains.filter((v) => v !== chainId)
        : [...previousChains, chainId];

      setDraft({ ...draft, chains });
    },
    [draft],
  );

  const handleSave = useCallback(() => {
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
      <form className="flex flex-col h-auto text-slate-50/90">
        <fieldset>
          {WALLET_TYPES.map((walletType: string) => (
            <span>
              <input
                className="form-check-input h-4 w-4 mt-1 align-top ml-[0.4rem] mr-1"
                type="radio"
                name="type"
                value={walletType}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setDraft({ ...draft, type: event.target.value })
                }
              />
              {walletType.toUpperCase()}
            </span>
          ))}
        </fieldset>
        <fieldset>
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
        </fieldset>
        {draft.type !== 'solana' && (
          <fieldset>
            {supportedChains.map((chainId: string) => (
              <span>
                <input
                  className="form-check-input h-4 w-4 mt-1 align-top ml-[0.4rem] mr-1"
                  type="checkbox"
                  name="networks"
                  value={chainId}
                  onChange={handleChains}
                />
                {chainId.toUpperCase()}
              </span>
            ))}
          </fieldset>
        )}
        <button type="button" onClick={handleSave}>
          Append
        </button>
      </form>
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
