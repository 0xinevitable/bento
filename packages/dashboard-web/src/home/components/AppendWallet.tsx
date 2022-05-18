import React, { useState } from 'react';
import clsx from 'clsx';

const networkType = ['eth', 'osmosis', 'solana'];
const network = ['ethereum', 'polygon', 'klaytn'];

export const AppendWallet: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <li
      className={clsx(
        'mb-2 pb-2 h-fit overflow-hidden',
        'border border-slate-700 rounded-md drop-shadow-2xl',
        'bg-slate-800/25 backdrop-blur-md flex flex-col cursor-pointer',
      )}
      onClick={() => setCollapsed((prev) => !prev)}
    >
      <div className={clsx('pt-2 px-3 flex items-center')}>
        <span className="text-xl font-bold text-slate-50/90">Add Wallet</span>
      </div>

      <ul
        className={clsx(
          'px-3 flex flex-col overflow-hidden',
          collapsed ? 'max-h-0' : 'max-h-[512px]',
        )}
        style={{ transition: 'max-height 1s ease-in-out' }}
      >
        <div className="flex flex-row justify-center">
          <div className="flex justify-center">
            {networkType.map((net: string) => (
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input h-4 w-4 mt-1 align-top mr-2"
                  type="radio"
                  name="type"
                  value={net}
                />
                <label
                  className="form-check-label inline-block text-gray-800 mr-4"
                  htmlFor={net}
                >
                  <span className=" text-slate-50/90">{net}</span>
                </label>
              </div>
            ))}
          </div>
          <div>
            <input type="text" name="Address" placeholder="Address" />
            <select name="network" multiple>
              {network.map((net: string) => (
                <option value={net}>{net}</option>
              ))}
            </select>
          </div>
        </div>
      </ul>
    </li>
  );
};
