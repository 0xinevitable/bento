import { WALLET_TYPES } from '@bento/core/lib/types';
import { shortenAddress } from '@bento/core/lib/utils';
import React, { useCallback } from 'react';
import { Store } from 'react-notifications-component';
import { useRecoilState } from 'recoil';

import { NoSSR } from '@/components/NoSSR';
import { walletsAtom } from '@/recoil/wallets';
import { copyToClipboard } from '@/utils/clipboard';

export const WalletList = () => {
  const [wallets, setWallets] = useRecoilState(walletsAtom);

  const onClickCopy = useCallback((text) => {
    copyToClipboard(text);
    Store.addNotification({
      title: 'Copied to Clipboard!',
      message: text,
      type: 'success',
      insert: 'top',
      container: 'top-right',
      animationIn: ['animate__animated', 'animate__fadeIn'],
      animationOut: ['animate__animated', 'animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
      },
    });
  }, []);

  return (
    <NoSSR>
      <div className="mt-4">
        <ul>
          {wallets.map((wallet) => (
            <li className="p-1 py-2 flex items-center" key={wallet.address}>
              <img
                className="w-10 h-10 rounded-full overflow-hidden shadow-md ring-1 ring-slate-100/25"
                src={WALLET_TYPES[wallet.type].logo}
              />
              <div className="ml-2 flex flex-col flex-1">
                <div className="flex items-center">
                  <span className="text-white/60 text-lg">
                    {shortenAddress(wallet.address)}
                  </span>
                  <button
                    className="ml-1 text-white"
                    onClick={() => onClickCopy(wallet.address)}
                  >
                    Copy
                  </button>

                  <span
                    className="ml-auto text-xs text-white/25"
                    onClick={() => {
                      setWallets(
                        wallets.filter((w) => w.address !== wallet.address),
                      );
                    }}
                  >
                    REMOVE
                  </span>
                </div>

                <div>
                  {wallet.type !== 'solana' ? (
                    wallet.chains.map((chain) => (
                      <span
                        key={chain}
                        className="mr-1 p-[2px] px-[3px] text-xs rounded bg-slate-100/25 text-slate-100/60"
                      >
                        {chain}
                      </span>
                    ))
                  ) : (
                    <span className="mr-1 p-[2px] px-[3px] text-xs rounded bg-slate-100/25 text-slate-100/60">
                      solana
                    </span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </NoSSR>
  );
};
