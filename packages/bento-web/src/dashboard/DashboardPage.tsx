import groupBy from 'lodash.groupby';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { walletsAtom } from '@/recoil/wallets';

import { AddWalletModal } from './components/AddWalletModal';
import { AssetRatioChart } from './components/AssetRatioChart';
import { AssetRatioListItem } from './components/AssetRatioListItem';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import { WalletList } from './components/WalletList';
import { displayName } from './constants/platform';
import { IntroSection } from './sections/IntroSection';
import { WalletBalance } from './types/balance';
import { useNFTBalances } from './utils/useNFTBalances';
import { useWalletBalances } from './utils/useWalletBalances';

const walletBalanceReducer =
  (symbol: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    balance.symbol === symbol ? callback(acc, balance) : acc;

const DashboardPage = () => {
  const wallets = useRecoilValue(walletsAtom);
  const { balances: walletBalances } = useWalletBalances({ wallets });
  const { balances: NFTBalances } = useNFTBalances({ wallets });

  const tokenBalances = useMemo(() => {
    // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
    // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
    const balancesByPlatform = Object.entries(
      groupBy<WalletBalance>(
        [...walletBalances, ...NFTBalances],
        (balance) => balance.symbol + balance.name,
      ),
    ).map((v) => v[1]);

    const tokens = balancesByPlatform
      .map((balances) => {
        // NOTE: balances 는 모두 같은 토큰의 정보를 담고 있기에, first 에서만 정보를 꺼내온다.
        const [first] = balances;

        const amount = balances.reduce(
          walletBalanceReducer(
            first.symbol,
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
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    return tokens.filter((v) => v.netWorth > 0);
  }, [walletBalances, NFTBalances]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
  );

  const assetRatioByPlatform = useMemo(() => {
    const groups = groupBy(tokenBalances, 'platform');
    return Object.entries(groups).map(([platform, assets]) => {
      const netWorth = assets.reduce((acc, info) => acc + info.netWorth, 0);
      return {
        platform,
        netWorth,
        name: displayName(platform),
        ratio: (netWorth / netWorthInUSD) * 100,
      };
    });
  }, [netWorthInUSD]);

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  useEffect(() => setPageLoaded(true), []);

  const hasWallet = wallets.length > 0;

  return (
    <PageContainer className="pt-0 z-10">
      <TopLeftBlur src="/assets/blurs/top-left.png" />
      <TopRightBlur src="/assets/blurs/top-right.png" />

      {!pageLoaded ? null : !hasWallet ? (
        <IntroSection
          onClickConnectWallet={() => setAddWalletModalVisible((prev) => !prev)}
        />
      ) : (
        <React.Fragment>
          <div className="mt-6 flex w-full gap-6">
            <Card>
              <CardTitle>Net Worth</CardTitle>
              <span className="mt-2 text-3xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
              <div className="mt-6 w-full flex">
                <div>
                  <AssetRatioChart
                    tokenBalances={tokenBalances}
                    netWorthInUSD={netWorthInUSD}
                  />
                </div>
                {assetRatioByPlatform.length && (
                  <AssetCardList className="flex-1">
                    {assetRatioByPlatform.map((item) => (
                      <AssetRatioListItem key={item.platform} {...item} />
                    ))}
                  </AssetCardList>
                )}
              </div>
            </Card>
            <Card className="max-w-[400px]">
              <CardTitle>
                Wallets
                {wallets.length > 0 && (
                  <span className="ml-1 text-slate-50/80 text-[#88a9ca]">
                    {`(${wallets.length.toLocaleString()})`}
                  </span>
                )}
              </CardTitle>

              {wallets.length > 0 && (
                <WalletList
                  onClickConnect={() =>
                    setAddWalletModalVisible((prev) => !prev)
                  }
                />
              )}
            </Card>
          </div>

          <Card className="mt-12" style={{ flex: 0 }}>
            <CardTitle>
              Assets
              {tokenBalances.length > 0 && (
                <span className="ml-1 text-slate-50/80 text-[#88a9ca]">
                  {`(${tokenBalances.length.toLocaleString()})`}
                </span>
              )}
            </CardTitle>
            {tokenBalances.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {tokenBalances.map((info) => (
                  <TokenBalanceItem
                    key={`${info.symbol}-${
                      'tokenAddress' in info ? info.tokenAddress : 'native'
                    }`}
                    {...info}
                  />
                ))}
              </ul>
            )}
          </Card>

          <div className="w-full h-24" />
        </React.Fragment>
      )}

      <AddWalletModal
        visible={isAddWalletModalVisible}
        onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
      />
    </PageContainer>
  );
};

export default DashboardPage;

const TOP_LEFT_BLUR = 262.9;
const TopLeftBlur = styled.img`
  position: absolute;
  top: 360px;
  left: 63px;

  margin: ${-TOP_LEFT_BLUR}px;
  width: ${280.42 + TOP_LEFT_BLUR * 2}px;
  height: ${280.42 + TOP_LEFT_BLUR * 2}px;
  z-index: -1;
  user-select: none;
`;
const TOP_RIGHT_BLUR = 256;
const TopRightBlur = styled.img`
  position: absolute;
  top: -35px;
  right: 64.48px;

  margin: ${-TOP_RIGHT_BLUR}px;
  width: ${402 + TOP_RIGHT_BLUR * 2}px;
  height: ${47 + TOP_RIGHT_BLUR * 2}px;
  z-index: -1;
  user-select: none;
`;

const Card = styled.section`
  padding: 24px;
  height: fit-content;

  flex: 1;
  display: flex;
  flex-direction: column;

  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(30, 29, 34, 0.44);
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1ㅌ), 0 2px 8px #191722;
`;
const CardTitle = styled.h2`
  margin: 0;
  margin-bottom: 8px;

  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  color: #ffffff;
`;

const AssetCardList = styled.ul`
  margin: 0;
  margin-left: 20px;
  padding: 10px 12px;
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
  box-shadow: inset 5px 5px 16px #0b0c0e, inset -5px -5px 16px #212426;
  border-radius: 8px;
`;
