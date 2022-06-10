import groupBy from 'lodash.groupby';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { useAxiosSWR } from '@/hooks/useAxiosSWR';
import { WalletBalance as CosmosSDKWalletBalance } from '@/pages/api/cosmos-sdk/[network]/[walletAddress]';
import { WalletBalance } from '@/pages/api/evm/[network]/[walletAddress]';
import { walletsAtom } from '@/recoil/wallets';

import { TokenBalanceItem } from './components/TokenBalanceItem';
import { WalletList } from './components/WalletList';
import { Web3Connector } from './components/Web3Connector';

const PIE_WIDTH = 12;

const walletBalanceReducer =
  (
    symbol: string,
    callback: (
      acc: number,
      balance: WalletBalance | CosmosSDKWalletBalance,
    ) => number,
  ) =>
  (acc: number, balance: WalletBalance | CosmosSDKWalletBalance) =>
    balance.symbol === symbol ? callback(acc, balance) : acc;

const DashboardPage = () => {
  const wallets = useRecoilValue(walletsAtom);

  const [
    cosmosWalletQuery,
    ethereumWalletQuery,
    polygonWalletQuery,
    klaytnWalletQuery,
    solanaWalletQuery,
  ] = useMemo(() => {
    const addrs = wallets.reduce(
      (acc, wallet) => {
        if (wallet.type === 'cosmos-sdk') {
          return { ...acc, cosmos: [...acc.cosmos, wallet.address] };
        }
        if (wallet.type === 'solana') {
          return { ...acc, solana: [...acc.solana, wallet.address] };
        }
        if (wallet.type !== 'evm') {
          return acc;
        }

        let _acc = acc;
        if (wallet.chains.includes('ethereum')) {
          _acc = { ..._acc, ethereum: [..._acc.ethereum, wallet.address] };
        }
        if (wallet.chains.includes('polygon')) {
          _acc = { ..._acc, polygon: [..._acc.polygon, wallet.address] };
        }
        if (wallet.chains.includes('klaytn')) {
          _acc = { ..._acc, klaytn: [..._acc.klaytn, wallet.address] };
        }
        return _acc;
      },
      { cosmos: [], solana: [], klaytn: [], polygon: [], ethereum: [] },
    );

    return [
      addrs.cosmos.join(','),
      addrs.ethereum.join(','),
      addrs.polygon.join(','),
      addrs.klaytn.join(','),
      addrs.solana.join(','),
    ];
  }, [wallets]);

  const { data: ethereumBalance = [] } = useAxiosSWR<WalletBalance[]>(
    !ethereumWalletQuery ? null : `/api/evm/ethereum/${ethereumWalletQuery}`,
  );
  const { data: polygonBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !polygonWalletQuery ? null : `/api/evm/polygon/${polygonWalletQuery}`,
  );
  const { data: klaytnBalance = [] } = useAxiosSWR<WalletBalance[]>(
    !klaytnWalletQuery ? null : `/api/evm/klaytn/${klaytnWalletQuery}`,
  );
  const { data: cosmosHubBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !cosmosWalletQuery
      ? null
      : `/api/cosmos-sdk/cosmos-hub/${cosmosWalletQuery}`,
  );
  const { data: osmosisBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !cosmosWalletQuery ? null : `/api/cosmos-sdk/osmosis/${cosmosWalletQuery}`,
  );
  const { data: solanaBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !solanaWalletQuery ? null : `/api/solana/mainnet/${solanaWalletQuery}`,
  );

  const tokenBalances = useMemo(() => {
    // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
    // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
    const balancesByPlatform = Object.entries(
      groupBy(
        [
          ethereumBalance,
          polygonBalance,
          klaytnBalance,
          cosmosHubBalance,
          osmosisBalance,
          solanaBalance,
        ].flat(),
        (balance) => balance.symbol + balance.name,
      ),
    ).map((v) => v[1]);

    const tokens = balancesByPlatform
      .map((balances) => {
        // NOTE: balances 는 모두 같은 토큰의 정보를 담고 있기에, first 에서만 정보를 꺼내온다.
        const [first] = balances;

        return {
          symbol: first.symbol,
          name: first.name,
          logo: first.logo,
          tokenAddress: 'address' in first ? first.address : null,
          balances: balances,
          netWorth: balances.reduce(
            walletBalanceReducer(
              first.symbol,
              (acc, balance) =>
                acc +
                (balance.balance +
                  ('delegations' in balance ? balance.delegations : 0)) *
                  balance.price,
            ),
            0,
          ),
          amount: balances.reduce(
            walletBalanceReducer(
              first.symbol,
              (acc, balance) =>
                acc +
                balance.balance +
                ('delegations' in balance ? balance.delegations : 0),
            ),
            0,
          ),
          price: first.price,
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    console.log(tokens);
    return tokens.filter((v) => v.netWorth > 0);
  }, [
    ethereumBalance,
    polygonBalance,
    klaytnBalance,
    cosmosHubBalance,
    osmosisBalance,
    solanaBalance,
  ]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
  );

  const data = useMemo(
    () =>
      tokenBalances.map((info) => {
        const { symbol, name, netWorth } = info;
        const percentage = (netWorth / netWorthInUSD) * 100;
        return {
          label: `${symbol} ${name}`,
          value: !percentage || isNaN(percentage) ? 0 : percentage,
        };
      }),
    [tokenBalances],
  );

  return (
    <PageContainer className="pt-0">
      <div className="absolute top-2 left-2 w-[120px] h-[120px] rounded-full bg-[#fa3737] blur-[88px] -z-10" />

      <div className="mt-10 w-full flex justify-between">
        <div className="flex flex-col justify-center">
          <span className="text-md text-slate-50">Net worth</span>
          <span className="mt-2 text-2xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
        </div>

        <div className="flex flex-col">
          <Web3Connector />
          <Link href="/onboarding" passHref>
            <a className="text-white">Onboarding</a>
          </Link>
        </div>
      </div>

      <div className="flex">
        <div className="flex-1 min-w-sm flex">
          <ChartContainer>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={100 - PIE_WIDTH}
                  outerRadius={100}
                  cornerRadius={PIE_WIDTH}
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={90 + 360}
                  dataKey="value"
                  minAngle={PIE_WIDTH - 2}
                >
                  {data.map((_, index) => (
                    <Cell
                      key={index}
                      fill={
                        [
                          '#FF214A',
                          '#f72585',
                          '#FAA945',
                          '#d446ff',
                          '#7c44ff',
                          '#656fff',
                          '#4cc9f0',
                        ][index]
                      }
                      stroke="transparent"
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <AvatarContainer>
              <Avatar src="/assets/avatar.png" />
            </AvatarContainer>
          </ChartContainer>
        </div>
        <div className="flex-1">
          <WalletList />
        </div>
      </div>

      <ul className="mt-8 flex flex-wrap gap-2">
        {tokenBalances.map((info) => (
          <TokenBalanceItem
            key={`${info.symbol}-${
              'tokenAddress' in info ? info.tokenAddress : 'native'
            }`}
            logo={info.logo ?? ''}
            {...info}
          />
        ))}
      </ul>
    </PageContainer>
  );
};

export default DashboardPage;

const ChartContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const AvatarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
const Avatar = styled.img`
  width: 154px;
  height: 154px;
  border-radius: 50%;
  user-select: none;
`;
