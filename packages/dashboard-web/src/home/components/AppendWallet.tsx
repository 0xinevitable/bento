import React, { useState } from 'react';
import clsx from 'clsx';
import { ERCBasedNetworks, Wallet } from '@dashboard/core/lib/config';

const networkType = ['eth', 'osmosis', 'solana'];
const network: ERCBasedNetworks[] = ['ethereum', 'polygon', 'klaytn'];

export const AppendWallet: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [walletInfo, setWalletInfo] = useState<Wallet>({
    type: '',
    address: '',
    networks: ['klaytn'], //dummy
  });

  const handleType = (event: React.ChangeEvent<HTMLInputElement>) =>
    setWalletInfo({ ...walletInfo, type: event.target.value });
  const handleAddress = (event: React.ChangeEvent<HTMLInputElement>) =>
    setWalletInfo({ ...walletInfo, address: event.target.value });
  //TODO make handleNetworks
  const handleSave = (event: React.MouseEvent) => saveWalletsInfo(walletInfo);
  const handleClear = (event: React.MouseEvent) =>
    localStorage.removeItem('wallet');

  return (
    <li
      className={clsx(
        'mb-2 pb-2 h-fit overflow-hidden',
        'border border-slate-700 rounded-md drop-shadow-2xl',
        'bg-slate-800/25 backdrop-blur-md flex flex-col cursor-pointer',
      )}
    >
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
            {networkType.map((net: string) => (
              <span>
                <input
                  className="form-check-input h-4 w-4 mt-1 align-top ml-[0.4rem] mr-1"
                  type="radio"
                  name="type"
                  value={net}
                  onChange={handleType}
                />
                {net.toUpperCase()}
              </span>
            ))}
          </fieldset>
          <fieldset>
            <input
              type="text"
              name="Address"
              placeholder="Address"
              onChange={handleAddress}
            />
            <select name="network" multiple className="h-auto">
              {network.map((net: ERCBasedNetworks) => (
                <option value={net}>{net}</option>
              ))}
            </select>
          </fieldset>
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
