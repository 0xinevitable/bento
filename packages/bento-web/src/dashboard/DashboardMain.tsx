import { Badge, Checkbox } from '@bento/client/components';
import { DashboardTokenBalance } from '@bento/client/dashboard/types/TokenBalance';
import { WalletBalance } from '@bento/client/dashboard/types/WalletBalance';
import { useNFTBalances } from '@bento/client/dashboard/utils/useNFTBalances';
import { useWalletBalances } from '@bento/client/dashboard/utils/useWalletBalances';
import { useLocalStorage } from '@bento/client/hooks/useLocalStorage';
import { Colors, systemFontStack } from '@bento/client/styles';
import { Analytics } from '@bento/client/utils';
import { Wallet } from '@bento/common';
import groupBy from 'lodash.groupby';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { TokenBalanceItem } from './components/TokenBalanceItem';
import { TokenDetailModalParams } from './components/TokenDetailModal';
import { AssetRatioSection } from './sections/AssetRatioSection';
import { WalletListSection } from './sections/WalletListSection';

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

type DashboardMainProps = {
  wallets: Wallet[];
  setAddWalletModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenDetailModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenDetailModalParams: React.Dispatch<
    React.SetStateAction<TokenDetailModalParams>
  >;
};

export const DashboardMain: React.FC<DashboardMainProps> = ({
  wallets,
  setAddWalletModalVisible,
  setTokenDetailModalVisible,
  setTokenDetailModalParams,
}) => {
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
          coinGeckoId: 'coinGeckoId' in first ? first.coinGeckoId : undefined,
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

  return (
    <React.Fragment>
      <div style={{ width: '100%', height: 32 }} />

      <DashboardContent>
        <TopSummaryContainer>
          <AssetRatioSection
            netWorthInUSD={netWorthInUSD}
            tokenBalances={tokenBalances}
          />

          <WalletListSection
            onClickAddWallet={() => setAddWalletModalVisible((prev) => !prev)}
          />
        </TopSummaryContainer>

        <div>
          <SectionTitle
            style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}
          >
            <span className="title">Assets</span>
            <InlineBadge>
              {renderedTokenBalances.length > 0
                ? renderedTokenBalances.length.toLocaleString()
                : '-'}
            </InlineBadge>
          </SectionTitle>

          <div className="mb-4 w-full flex items-center">
            <div
              className="flex items-center cursor-pointer select-none"
              onClick={() => {
                if (!isNFTsShown) {
                  // showing
                  Analytics.logEvent('click_show_nfts', undefined);
                } else {
                  // hiding
                  Analytics.logEvent('click_hide_nfts', undefined);
                }
                setNFTsShown(!isNFTsShown);
              }}
            >
              <Checkbox checked={isNFTsShown ?? false} readOnly />
              <span className="ml-[6px] text-white/80 text-sm">Show NFTs</span>
            </div>
          </div>

          <AssetListCard>
            {renderedTokenBalances.length > 0 && (
              <ul>
                {renderedTokenBalances.map((item) => {
                  const key = `${item.symbol ?? item.name}-${
                    'tokenAddress' in item ? item.tokenAddress : 'native'
                  }`;
                  return (
                    <TokenBalanceItem
                      key={key}
                      tokenBalance={item}
                      onClick={() => {
                        Analytics.logEvent('click_balance_item', {
                          name: item.name,
                          symbol: item.symbol ?? undefined,
                          platform: item.platform,
                          address: item.tokenAddress ?? undefined,
                        });
                        setTokenDetailModalVisible((prev) => !prev);
                        setTokenDetailModalParams({ tokenBalance: item });
                      }}
                    />
                  );
                })}
              </ul>
            )}
          </AssetListCard>
        </div>
      </DashboardContent>

      <div className="w-full h-24" />
    </React.Fragment>
  );
};

export default DashboardMain;

const DashboardContent = styled.div`
  padding: 27px 33px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  background: ${Colors.black};
  border: 1px solid ${Colors.gray700};
  border-radius: 16px;

  @media screen and (max-width: 940px) {
    padding: 0;
    border: 0;
  }
`;
const TopSummaryContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 32px;

  @media screen and (max-width: 940px) {
    flex-direction: column;
  }
`;

const AssetListCard = styled.section`
  padding: 16px;
  height: fit-content;

  flex: 1;
  display: flex;
  flex-direction: column;

  background: ${Colors.gray850};
  border-radius: 8px;

  @media screen and (max-width: 400px) {
    padding: 12px;
  }

  & > ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`;

const SectionTitle = styled.h3`
  /* FIXME: !important */
  &,
  & > span.title {
    font-family: 'Raleway', ${systemFontStack} !important;
  }

  margin-bottom: 16px;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};
`;

const InlineBadge = styled(Badge)`
  && {
    margin-left: 8px;
    padding: 6px;
    display: inline-flex;
    font-size: 13px;
    backdrop-filter: none;
  }
`;
