import clsx from 'clsx';
import { useMemo } from 'react';
import styled from 'styled-components';

import { PLATFORM_LOGOS } from '../constants/platform';
import { WalletBalance } from '../types/balance';

// import { TokenBalanceRatioBar } from './TokenBalanceRatioBar';
// import { TokenIcon } from './TokenIcon';

type TokenBalanceItemProps = {
  platform: string;
  symbol: string;
  name: string;
  logo?: string;
  netWorth: number;
  amount: number;
  price: number;
  balances: WalletBalance[];
};

export const TokenBalanceItem: React.FC<TokenBalanceItemProps> = (info) => {
  // const [collapsed, setCollapsed] = useState<boolean>(true);

  // const balances = useMemo(() => {
  //   const items = info.balances.map(
  //     (balance: WalletBalance) => {
  //       const delegations = 'delegations' in balance ? balance.delegations : 0;
  //       const percentage =
  //         ((balance.balance + delegations) / info.amount) * 100;
  //       const shortenedWalletAddress = shortenAddress(balance.walletAddress);

  //       return {
  //         price: balance.price,
  //         balance: balance.balance,
  //         delegations,
  //         percentage,
  //         shortenedWalletAddress,
  //       };
  //     },
  //   );

  //   items.sort((a, b) => b.percentage - a.percentage);

  //   return items;
  // }, [info.balances]);

  const platformURL = useMemo(
    () => PLATFORM_LOGOS[info.platform as keyof typeof PLATFORM_LOGOS],
    [info.platform],
  );

  return (
    <Container
      className={clsx(
        'py-3 p-3 h-fit rounded-md drop-shadow-2xl',
        'flex flex-col cursor-pointer',
      )}
      // onClick={() => setCollapsed((prev) => !prev)}
    >
      <div className="flex items-center">
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={info.logo}
            alt={info.name}
          />
          <img
            className="w-6 h-6 absolute bottom-[-8px] left-[-8px] rounded-full ring-2 ring-black/20"
            src={platformURL}
          />
        </div>
        <div className="ml-4 min-w-0 flex flex-col flex-1">
          <span className="text-sm truncate text-slate-400/40">
            <span className="text-slate-400">{info.symbol}</span>
            <span className="ml-1 text-xs text-slate-400/40">
              {info.amount.toLocaleString()}
            </span>
          </span>
          <span className="text-xl font-bold text-slate-50/90">
            {`$${info.netWorth.toLocaleString()}`}

            {info.amount !== 1 && (
              <span className="ml-1 text-sm font-medium text-slate-400/40">
                {`$${info.price.toLocaleString()}`}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* <TokenBalanceRatioBar className="pl-2" balances={info.balances} /> */}

      {/* <ul
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
      </ul> */}
    </Container>
  );
};

const Container = styled.li`
  width: calc(33.33% - 8px);

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
  box-shadow: inset 5px 5px 16px #0b0c0e, inset -5px -5px 16px #212426;
  border-radius: 8px;

  @media screen and (max-width: 797px) {
    width: calc(50% - 4px);
  }

  @media screen and (max-width: 537px) {
    width: 100%;
  }

  img {
    user-select: none;
  }
`;
