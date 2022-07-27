import groupBy from 'lodash.groupby';
import React, { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { WalletBalance } from '@/dashboard/types/WalletBalance';
import { useWalletBalances } from '@/dashboard/utils/useWalletBalances';
import { walletsAtom } from '@/recoil/wallets';

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

export const AssetSection = () => {
  const wallets = useRecoilValue(walletsAtom);
  const { balances: walletBalances } = useWalletBalances({ wallets });

  const tokenBalances = useMemo<DashboardTokenBalance[]>(() => {
    // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
    // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
    const balancesByPlatform = Object.entries(
      groupBy<WalletBalance>(
        [...walletBalances],
        (balance) => balance.symbol + balance.name,
      ),
    ).map((v) => v[1]);

    const tokens = balancesByPlatform
      .map((balances) => {
        // NOTE: balances 는 모두 같은 토큰의 정보를 담고 있기에, first 에서만 정보를 꺼내온다.
        const [first] = balances;

        const amount = balances.reduce(
          walletBalanceReducer(
            first.symbol ?? first.name,
            (acc, balance) =>
              acc +
              balance.balance +
              ('delegations' in balance ? balance.delegations : 0),
          ),
          0,
        );

        return {
          platform: first.platform,
          symbol: first.symbol,
          name: first.name,
          logo: first.logo,
          type: 'type' in first ? first.type : undefined,
          tokenAddress: 'address' in first ? first.address : undefined,
          balances: balances,
          netWorth: amount * first.price,
          amount,
          price: first.price,
          coinGeckoId: 'coinGeckoId' in first ? first.coinGeckoId : undefined,
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    return tokens.filter((v) => v.netWorth > 0);
  }, [walletBalances]);

  return (
    <ul>
      {tokenBalances.map((item) => {
        return (
          <Container>
            <Logo src={item.logo} />
            <Information>
              <Title>{item.name}</Title>
              <Description>
                <span>{`$${item.netWorth.toLocaleString()}`}</span>
                <span className="ml-2 text-white/60">
                  {`${item.amount.toLocaleString()} ${item.symbol}`}
                </span>
              </Description>
            </Information>
          </Container>
        );
      })}
    </ul>
  );
};

const Container = styled.li`
  margin-top: 8px;
  display: flex;
  padding: 12px;
  background-color: #262b34;
  border-radius: 8px;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const Information = styled.div`
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 9;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: white;
  word-break: keep-all;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);
`;
