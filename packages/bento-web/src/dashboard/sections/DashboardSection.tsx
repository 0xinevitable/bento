import { Wallet } from '@bento/common';
import { Icon } from '@iconify/react';
import clsx from 'clsx';
import groupBy from 'lodash.groupby';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { Checkbox } from '@/components/Checkbox';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Analytics } from '@/utils/analytics';

import { TokenBalanceItem } from '../components/TokenBalanceItem';
import { TokenDetailModalParams } from '../components/TokenDetailModal';
import { WalletList } from '../components/WalletList';
import { AssetRatioSection } from '../sections/AssetRatioSection';
import { DashboardTokenBalance } from '../types/TokenBalance';
import { WalletBalance } from '../types/WalletBalance';
import { useNFTBalances } from '../utils/useNFTBalances';
import { useWalletBalances } from '../utils/useWalletBalances';

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

type DashboardSectionProps = {
  wallets: Wallet[];
  setAddWalletModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenDetailModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenDetailModalParams: React.Dispatch<
    React.SetStateAction<TokenDetailModalParams>
  >;
};

export const DashboardSection: React.FC<DashboardSectionProps> = ({
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
        <Card>
          <CardTitle>Net Worth</CardTitle>
          <span className="mt-2 text-3xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
          <AssetRatioSection
            netWorthInUSD={netWorthInUSD}
            tokenBalances={tokenBalances}
          />
        </Card>
        <Card className="max-w-[400px]">
          <div
            className={clsx(
              'w-full flex justify-between items-center',
              isMobile && 'cursor-pointer select-none',
            )}
            onClick={() => {
              setWalletListOpen((prev) => {
                if (prev === false) {
                  // opening
                  Analytics.logEvent(
                    'click_dashboard_main_show_wallet_list',
                    undefined,
                  );
                } else {
                  // closing
                  Analytics.logEvent(
                    'click_dashboard_main_hide_wallet_list',
                    undefined,
                  );
                }
                return !prev;
              });
            }}
          >
            <PlainCardTitle>
              <span>Wallets</span>
              <InlineBadge>
                {wallets.length > 0 //
                  ? wallets.length.toLocaleString()
                  : '-'}
              </InlineBadge>
            </PlainCardTitle>

            {isMobile && (
              <IconButton
                className={isWalletListOpen ? 'open' : 'closed'}
                onClick={() => setWalletListOpen((prev) => !prev)}
              >
                <Icon icon="fa-solid:chevron-down" width={12} height={12} />
              </IconButton>
            )}
          </div>

          {(isMobile ? isWalletListOpen : true) && wallets.length > 0 && (
            <WalletList
              className="mt-2"
              onClickConnect={() => setAddWalletModalVisible((prev) => !prev)}
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
const PlainCardTitle = styled(CardTitle)`
  margin-bottom: 0;
`;
const IconButton = styled.button`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.65);

  display: flex;
  align-items: center;
  justify-content: center;

  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.9);
  }

  &.open {
    transform: rotate(180deg);

    & > svg {
      margin-top: 2px;
    }
  }
`;

const InlineBadge = styled(Badge)`
  margin-left: 8px;
  padding: 6px;
  display: inline-flex;
  font-size: 13px;
  backdrop-filter: none;
`;
