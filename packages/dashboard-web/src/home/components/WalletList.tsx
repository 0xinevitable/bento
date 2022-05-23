import React from 'react';
import { useRecoilValue } from 'recoil';

import { walletsAtom } from '@/recoil/wallets';
import { shortenAddress } from '@dashboard/core/lib/utils';
import { NoSSR } from '@/components/NoSSR';

const LOGO_URLS = {
  erc: '/assets/ethereum.png',
  tendermint: '/assets/tendermint.png',
  solana: '/assets/solana.png',
};

export const WalletList = () => {
  const wallets = useRecoilValue(walletsAtom);

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
            </li>
          ))}
        </ul>
      </div>
    </NoSSR>
  );
};
