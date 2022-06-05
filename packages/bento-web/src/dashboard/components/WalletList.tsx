import { shortenAddress } from '@bento/core/lib/utils';
import React, { useCallback } from 'react';
import { Store } from 'react-notifications-component';
import { useRecoilState } from 'recoil';

import { NoSSR } from '@/components/NoSSR';
import { walletsAtom } from '@/recoil/wallets';
import { copyToClipboard } from '@/utils/clipboard';

const LOGO_URLS = {
  evm: '/assets/ethereum.png',
  'cosmos-sdk': '/assets/tendermint.png',
  solana: '/assets/solana.png',
};

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
            <li className="p-1 flex items-center" key={wallet.address}>
              <img
                className="w-6 h-6 rounded-full overflow-hidden shadow-md ring-1 ring-slate-100/25"
                src={LOGO_URLS[wallet.type]}
              />
              <span className="ml-2 text-white/60">
                {shortenAddress(wallet.address)}
                <button
                  className="text-white"
                  onClick={() => onClickCopy(wallet.address)}
                >
                  Copy
                </button>
              </span>

              {wallet.type !== 'solana' && (
                <span className="ml-4 text-white/60">
                  {wallet.chains.map((chain) => (
                    <span
                      key={chain}
                      className="mr-1 p-1 text-xs rounded border border-white"
                    >
                      {chain}
                    </span>
                  ))}
                </span>
              )}

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
            </li>
          ))}
        </ul>
      </div>
    </NoSSR>
  );
};
