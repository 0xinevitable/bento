import { WalletBalance as TendermintWalletBalance } from '@/pages/api/tendermint/[network]/[walletAddress]';
import { WalletBalance } from '@/pages/api/erc/[network]/[walletAddress]';
import { shortenAddress } from '@dashboard/core/lib/utils';
import { TokenIcon } from './TokenIcon';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

type TokenBalanceItemProps = {
  symbol: string;
  name: string;
  logo: string;
  netWorth: number;
  amount: number;
  price: number;
  balances: (WalletBalance | TendermintWalletBalance)[];
};

export const TokenBalanceItem: React.FC<TokenBalanceItemProps> = (info) => {
  const [collapsed, setCollapsed] = useState<boolean>(true);

  const balances = useMemo(() => {
    const items = info.balances.map(
      (balance: WalletBalance | TendermintWalletBalance) => {
        const delegations = 'delegations' in balance ? balance.delegations : 0;
        const percentage =
          ((balance.balance + delegations) / info.amount) * 100;
        const shortenedWalletAddress = shortenAddress(balance.walletAddress);

        return {
          price: balance.price,
          balance: balance.balance,
          delegations,
          percentage,
          shortenedWalletAddress,
        };
      },
    );

    items.sort((a, b) => b.percentage - a.percentage);

    return items;
  }, [info.balances]);

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
        <TokenIcon src={info.logo} alt={info.name} />
        <div className="ml-4 flex flex-col">
          <span className="text-md">
            <span className="text-slate-400">{info.symbol}</span>
            <span className="ml-1 text-slate-400/40">
              {info.amount.toLocaleString()}
            </span>
          </span>
          <span className="text-2xl font-bold text-slate-50/90">
            {`$${info.netWorth.toLocaleString()}`}
          </span>
        </div>
      </div>

      <ul
        className={clsx(
          'px-3 flex flex-col overflow-hidden',
          collapsed ? 'max-h-0' : 'max-h-[512px]',
        )}
        style={{ transition: 'max-height 1s ease-in-out' }}
      >
        {balances.map((balance) => (
          <li key={balance.shortenedWalletAddress} className="flex align-top">
            <span className="text-sm font-bold text-slate-400/90 min-w-[56px]">
              {`${parseFloat(
                balance.percentage //
                  .toFixed(2)
                  .toString(),
              ).toLocaleString()}%`}
            </span>

            <span className="ml-2 text-sm text-slate-100/40 inline-flex min-w-[100px]">
              {balance.shortenedWalletAddress}
            </span>

            <div className="ml-4 text-sm text-slate-200/70 flex flex-col items-start">
              <span>
                <span className="text-xs">Wallet</span>
                &nbsp;
                {balance.balance.toLocaleString()}
              </span>

              {balance.delegations > 0 && (
                <span>
                  <span className="text-xs">Staking</span>
                  &nbsp;
                  {balance.delegations.toLocaleString()}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </li>
  );
};
