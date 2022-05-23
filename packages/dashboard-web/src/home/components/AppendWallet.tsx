import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Wallet, WALLET_TYPES } from '@dashboard/core/lib/config';

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
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const [wallets, setWallets] = useState<Wallet[]>([]);
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

  const handleClear = useCallback(() => setWallets([]), []);

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
    <li
      className={clsx(
        'mb-2 pb-2 h-fit overflow-hidden',
        'border border-slate-700 rounded-md drop-shadow-2xl',
        'bg-slate-800/25 backdrop-blur-md flex flex-col cursor-pointer',
      )}
    >
      <ul>
        <code className="text-white">{JSON.stringify(wallets)}</code>
      </ul>
      <div className={clsx('pt-2 px-3 flex items-center')}>
        <span
          className="text-xl font-bold text-slate-50/90"
          onClick={() => setCollapsed((prev) => !prev)}
        >
          Add Wallet
        </span>
      </div>

      <ul
        className={clsx(
          'px-3 flex flex-col overflow-hidden',
          collapsed ? 'max-h-0' : 'max-h-[512px]',
        )}
        style={{ transition: 'max-height 1s ease-in-out' }}
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
          <button type="button" onClick={handleClear}>
            Clear
          </button>
        </form>
      </ul>
    </li>
  );
};

const saveWalletsInfo = (wallet: Wallet) => {
  let walletList = getWalletsInfo();
  walletList.push(wallet);
  localStorage.setItem('wallet', JSON.stringify({ ...walletList }));
};

const getWalletsInfo = (): Wallet[] =>
  Object.values(JSON.parse(localStorage.getItem('wallet') ?? '{}'));
