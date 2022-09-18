import { Badge } from '@bento/client/components/Badge';
import { Button } from '@bento/client/components/Button';
import { Checkbox } from '@bento/client/components/Checkbox';
import { DashboardTokenBalance } from '@bento/client/dashboard/types/TokenBalance';
import { WalletBalance } from '@bento/client/dashboard/types/WalletBalance';
import { useNFTBalances } from '@bento/client/dashboard/utils/useNFTBalances';
import { useWalletBalances } from '@bento/client/dashboard/utils/useWalletBalances';
import { useLocalStorage } from '@bento/client/hooks/useLocalStorage';
import { useWindowSize } from '@bento/client/hooks/useWindowSize';
import { Colors } from '@bento/client/styles/colors';
import { systemFontStack } from '@bento/client/styles/fonts';
import { Analytics } from '@bento/client/utils/analytics';
import { Wallet } from '@bento/common';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import groupBy from 'lodash.groupby';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { TokenBalanceItem } from '../components/TokenBalanceItem';
import { TokenDetailModalParams } from '../components/TokenDetailModal';
import { WalletList } from '../components/WalletList';
import { AssetRatioCard } from './AssetRatioCard';

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

  const [isWalletListOpen, setWalletListOpen] = useState<boolean>(false);
  const { width: screenWidth } = useWindowSize();
  const isMobile = screenWidth <= 640;

  return (
    <React.Fragment>
      <TopSummaryContainer>
        <AssetRatioCard
          netWorthInUSD={netWorthInUSD}
          tokenBalances={tokenBalances}
        />

        <div className="flex-1 flex flex-col relative">
          <SectionTitleContainer>
            <SectionTitle>Wallets</SectionTitle>
          </SectionTitleContainer>

          <WalletList
            wallets={wallets}
            className="mt-2"
            onClickConnect={() => setAddWalletModalVisible((prev) => !prev)}
          />

          <div className="mt-[10px] flex justify-center">
            <Button>Add Another</Button>
          </div>
        </div>
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
      </Card>

      <div className="w-full h-24" />
    </React.Fragment>
  );
};

export default DashboardMain;

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

const SectionTitleContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  background-image: linear-gradient(
    to bottom,
    ${Colors.black} 40%,
    transparent
  );
`;
const SectionTitle = styled.h3`
  /* FIXME: !important */
  font-family: 'Raleway', ${systemFontStack} !important;
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};
`;

const InlineBadge = styled(Badge)`
  margin-left: 8px;
  padding: 6px;
  display: inline-flex;
  font-size: 13px;
  backdrop-filter: none;
`;
