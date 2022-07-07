import clsx from 'clsx';
import { useMemo } from 'react';
import styled from 'styled-components';

import { WalletBalance } from '../types/balance';
import { TokenBalanceRatioBar } from './TokenBalanceRatioBar';
import { TokenIcon } from './TokenIcon';

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

const PLATFORM_LOGOS = {
  ethereum: '/assets/ethereum.png',
  avalanche: '/assets/avalanche.png',
  bnb: 'https://assets-cdn.trustwallet.com/blockchains/binance/info/logo.png',
  polygon: '/assets/polygon.webp',
  klaytn: 'https://avatars.githubusercontent.com/u/41137100?s=200&v=4',
  cosmosHub:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png',
  osmosis:
    'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png',
  solana: '/assets/solana.png',
  opensea: '/assets/opensea.png',
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
        'pl-1 pr-3 pb-2 h-fit rounded-md drop-shadow-2xl',
        'flex flex-col cursor-pointer',
      )}
      // onClick={() => setCollapsed((prev) => !prev)}
    >
      <div className="ml-[-10px] pt-2 flex items-center">
        <TokenIcon src={info.logo} alt={info.name} />
        <img
          className="w-6 h-6 absolute top-12 left-[-4px] rounded-full ring-1 ring-black/40"
          src={platformURL}
        />
        <div className="ml-1 min-w-0 flex flex-col flex-1">
          <span className="text-sm truncate text-slate-400/40">
            <span className="text-slate-400">{info.symbol}</span>
            <span className="ml-1 text-xs text-slate-400/40">
              {info.amount.toLocaleString()}
            </span>
          </span>
          <span className="text-xl font-bold text-slate-50/90">
            {`$${info.netWorth.toLocaleString()}`}
          </span>
        </div>
      </div>

      <TokenBalanceRatioBar className="pl-2" balances={info.balances} />

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
  width: 250px;
  background: #121a32;
  border: 1px solid #020322;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 8px;

  @media screen and (max-width: 797px) {
    width: calc(50% - 4px);
  }

  @media screen and (max-width: 537px) {
    width: 100%;
  }
`;
