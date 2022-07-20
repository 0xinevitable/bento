import groupBy from 'lodash.groupby';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { Checkbox } from '@/components/Checkbox';
import { PageContainer } from '@/components/PageContainer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { walletsAtom } from '@/recoil/wallets';

import { AddWalletModal } from './components/AddWalletModal';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import {
  TokenDetailModal,
  TokenDetailModalParams,
} from './components/TokenDetailModal';
import { WalletList } from './components/WalletList';
import { AssetRatioSection } from './sections/AssetRatioSection';
import { IntroSection } from './sections/IntroSection';
import { DashboardTokenBalance } from './types/TokenBalance';
import { WalletBalance } from './types/WalletBalance';
import { useNFTBalances } from './utils/useNFTBalances';
import { useWalletBalances } from './utils/useWalletBalances';

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

const DashboardPage = () => {
  const wallets = useRecoilValue(walletsAtom);
  const { balances: walletBalances } = useWalletBalances({ wallets });
  const { balances: NFTBalances } = useNFTBalances({ wallets });

  const tokenBalances = useMemo<DashboardTokenBalance[]>(() => {
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
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    return tokens.filter((v) => v.netWorth > 0);
  }, [walletBalances, NFTBalances]);

  const [isNFTsShown, setNFTsShown] = useLocalStorage<boolean>(
    '@is-nfts-shown-v1',
    true,
  );
  const renderedTokenBalances = useMemo(() => {
    if (isNFTsShown) {
      return tokenBalances;
    }
    return tokenBalances.filter((v) => v.type !== 'nft');
  }, [isNFTsShown, tokenBalances]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
  );

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);
  const [isTokenDetailModalVisible, setTokenDetailModalVisible] =
    useState<boolean>(false);
  const [tokenDetailModalParams, setTokenDetailModalParams] =
    useState<TokenDetailModalParams>({});

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
          <TopSummaryContainer>
            <Card>
              <CardTitle>Net Worth</CardTitle>
              <span className="mt-2 text-3xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
              <AssetRatioSection
                netWorthInUSD={netWorthInUSD}
                tokenBalances={tokenBalances}
              />
            </Card>
            <Card className="max-w-[400px]">
              <CardTitle>
                <span>Wallets</span>
                <InlineBadge>
                  {wallets.length > 0 //
                    ? wallets.length.toLocaleString()
                    : '-'}
                </InlineBadge>
              </CardTitle>

              {wallets.length > 0 && (
                <WalletList
                  onClickConnect={() =>
                    setAddWalletModalVisible((prev) => !prev)
                  }
                />
              )}
            </Card>
          </TopSummaryContainer>

          <Card className="mt-12" style={{ flex: 0 }}>
            <CardTitle>
              <span>Assets</span>
              <InlineBadge>
                {renderedTokenBalances.length > 0
                  ? renderedTokenBalances.length.toLocaleString()
                  : '-'}
              </InlineBadge>
            </CardTitle>

            <div className="mt-3 w-full flex items-center">
              <div
                className="flex items-center cursor-pointer select-none"
                onClick={() => setNFTsShown(!isNFTsShown)}
              >
                <Checkbox checked={isNFTsShown ?? false} readOnly />
                <span className="ml-[6px] text-white/80 text-sm">
                  Show NFTs
                </span>
              </div>
            </div>

            {renderedTokenBalances.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {renderedTokenBalances.map((item) => {
                  const key = `${item.symbol ?? item.name}-${
                    'tokenAddress' in item ? item.tokenAddress : 'native'
                  }`;
                  return (
                    <TokenBalanceItem
                      key={key}
                      tokenBalance={item}
                      onClick={() => {
                        setTokenDetailModalVisible((prev) => !prev);
                        setTokenDetailModalParams({ tokenBalance: item });
                      }}
                    />
                  );
                })}
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
      <TokenDetailModal
        visible={isTokenDetailModalVisible}
        onDismiss={() => {
          setTokenDetailModalVisible((prev) => !prev);
          setTokenDetailModalParams({});
        }}
        {...tokenDetailModalParams}
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

const TopSummaryContainer = styled.div`
  margin-top: 24px;
  display: flex;
  width: 100%;
  gap: 24px;

  @media screen and (max-width: 1180px) {
    gap: 16px;
  }

  @media screen and (max-width: 940px) {
    flex-direction: column;

    & section {
      /* && { */
      max-width: unset;
      width: 100%;
      /* } */
    }
  }
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
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1), 0 2px 8px #191722;

  @media screen and (max-width: 400px) {
    padding: 20px;
  }

  @media screen and (max-width: 340px) {
    padding: 16px;
  }
`;
const CardTitle = styled.h2`
  margin: 0;
  margin-bottom: 8px;

  font-weight: 600;
  font-size: 18px;
  line-height: 100%;
  color: #ffffff;

  display: flex;
  align-items: center;
`;

const InlineBadge = styled(Badge)`
  margin-left: 8px;
  padding: 6px;
  display: inline-flex;
  font-size: 13px;
  backdrop-filter: none;
`;
