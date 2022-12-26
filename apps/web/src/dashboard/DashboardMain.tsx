import { BentoUser, Wallet } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import styled from '@emotion/styled';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';

import { AnimatedTab } from '@/components/AnimatedTab';
import { Checkbox, Skeleton } from '@/components/system';
import { useLazyEffect } from '@/hooks/useLazyEffect';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import { SearchBar } from '@/dashboard/components/SearchBar';
import { DeFiProtocolItem } from '@/dashboard/components/list-items/DeFiProtocolItem';
import { WalletBalanceItem } from '@/dashboard/components/list-items/WalletBalanceItem';
import { useProtocols } from '@/dashboard/hooks/useDeFis';
import { useNFTBalances } from '@/dashboard/hooks/useNFTBalances';
import { useWalletBalances } from '@/dashboard/hooks/useWalletBalances';
import {
  DashboardTokenBalance,
  WalletBalance,
} from '@/dashboard/types/TokenBalance';
import { UserProfile } from '@/profile/types/UserProfile';
import { Colors } from '@/styles';
import { Analytics, FeatureFlags } from '@/utils';

import { DetailModalParams } from './components/DetailModal';
import { EmptyBalance } from './components/EmptyBalance';
import { InlineBadge } from './components/InlineBadge';
import { Tab } from './components/Tab';
import { Breakpoints } from './constants/breakpoints';
import { KlaytnNFTAsset, useKlaytnNFTs } from './hooks/useKlaytnNFTs';
import { AssetRatioSection } from './sections/AssetRatioSection';
import { BadgeListSection } from './sections/BadgeListSection';
import { NFTListSection } from './sections/NFTListSection';
import { UserProfileSection } from './sections/UserProfileSection';
import { WalletListSection } from './sections/WalletListSection';

enum DashboardTabType {
  Crypto = 'Crypto',
  NFTs = 'NFTs',
  Badges = 'Badges',
}
const DASHBOARD_TAB_ITEMS = Object.values(DashboardTabType);

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

type DashboardMainProps = {
  isMyProfile: boolean;
  user: BentoUser;
  imageToken?: string;
  revalidateWallets?: () => Promise<Wallet[] | undefined>;
  setAddWalletModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setDetailModalParams: React.Dispatch<React.SetStateAction<DetailModalParams>>;

  selectedNFT: OpenSeaAsset | KlaytnNFTAsset | null;
  setSelectedNFT: (asset: OpenSeaAsset | KlaytnNFTAsset | null) => void;
};

export const DashboardMain: React.FC<DashboardMainProps> = ({
  isMyProfile,
  user,
  revalidateWallets,
  setAddWalletModalVisible,
  setDetailModalVisible,
  setDetailModalParams,

  selectedNFT,
  setSelectedNFT,
}) => {
  const { t, i18n } = useTranslation('dashboard');
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  const { balances: walletBalances } = useWalletBalances({
    wallets: user.wallets,
  });
  const { balances: nftBalances } = useNFTBalances({
    wallets: user.wallets,
  });
  const { klaytnNFTs } = useKlaytnNFTs(user.wallets);

  const nftAssets = useMemo<(OpenSeaAsset | KlaytnNFTAsset)[]>(() => {
    return [
      ...klaytnNFTs,
      ...(nftBalances?.flatMap((item) =>
        'assets' in item ? item.assets : [],
      ) ?? []),
    ];
  }, [nftBalances, klaytnNFTs]);

  const [tokenBalances, setTokenBalances] = useState<DashboardTokenBalance[]>(
    [],
  );

  useLazyEffect(
    () => {
      // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
      // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
      const balancesByPlatform = Object.entries(
        groupBy<WalletBalance>(
          [...walletBalances, ...nftBalances],
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
              (acc, balance) => acc + balance.balance,
            ),
            0,
          );

          return {
            platform: first.chain,
            symbol: first.symbol,
            name: first.name,
            logo: first.logo,
            type: first.type,
            tokenAddress: first.ind,
            balances: balances,
            netWorth: amount * first.price,
            amount,
            price: first.price,
            coinGeckoId: 'coinGeckoId' in first ? first.coinGeckoId : undefined,
          };
        })
        .flat();

      tokens.sort((a, b) => b.netWorth - a.netWorth);
      setTokenBalances(tokens.filter((v) => v.netWorth > 0));
    },
    [walletBalances, nftBalances],
    500,
  );

  const [isNFTBalancesIncluded, setNFTBalancesIncluded] =
    useLocalStorage<boolean>('@is-nfts-shown-v1', true);

  const renderedTokenBalances = useMemo(() => {
    if (isNFTBalancesIncluded) {
      return tokenBalances;
    }
    return tokenBalances.filter((v) => v.type !== 'nft');
  }, [isNFTBalancesIncluded, tokenBalances]);

  const netWorthInWallet = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
  );

  const [currentTab, setCurrentTab] = useState<DashboardTabType>(
    DashboardTabType.Crypto,
  );

  const [isNFTsInitialized, setNFTsInitialized] = useState<boolean>(false);
  useEffect(() => {
    if (currentTab === DashboardTabType.NFTs) {
      setNFTsInitialized(true);
    }
  }, [currentTab]);

  const { defis } = useProtocols(user.wallets);

  const netWorthInProtocols = useMemo(
    () =>
      defis.reduce(
        (acc, service) =>
          acc + service.protocols.reduce((a, v) => a + v.netWorth, 0),
        0,
      ),
    [defis],
  );

  const CRYPTO_FEEDS: ('DEFI' | 'WALLET')[] = useMemo(
    () =>
      netWorthInProtocols > netWorthInWallet
        ? ['DEFI', 'WALLET']
        : ['WALLET', 'DEFI'],
    [netWorthInProtocols, netWorthInWallet],
  );

  return (
    <React.Fragment>
      <div style={{ width: '100%', height: 32 }} />

      <DashboardWrapper>
        {FeatureFlags.isSearchEnabled && <SearchBar />}

        <UserProfileSection user={user} />

        <DashboardContentWrapper>
          <TabContainer>
            <Tab
              current={currentTab}
              onChange={setCurrentTab}
              items={DASHBOARD_TAB_ITEMS}
            />
          </TabContainer>
          <DashboardContent>
            <AnimatedTab
              className="tab-crypto"
              selected={currentTab === DashboardTabType.Crypto}
            >
              <TopSummaryContainer>
                <AssetRatioSection
                  netWorthInWallet={netWorthInWallet}
                  netWorthInProtocols={netWorthInProtocols}
                  tokenBalances={tokenBalances}
                  services={defis}
                />

                <WalletListSection
                  isMyProfile={isMyProfile}
                  wallets={user.wallets}
                  revalidateWallets={revalidateWallets}
                  onClickAddWallet={() =>
                    setAddWalletModalVisible((prev) => !prev)
                  }
                />
              </TopSummaryContainer>

              {CRYPTO_FEEDS.map((feedItem) => {
                if (feedItem === 'WALLET') {
                  return (
                    <div key={feedItem}>
                      <SectionTitle
                        style={{
                          marginBottom: 12,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span className="title">{t('Assets')}</span>
                        <InlineBadge>
                          {renderedTokenBalances.length > 0
                            ? renderedTokenBalances.length.toLocaleString()
                            : '-'}
                        </InlineBadge>
                      </SectionTitle>

                      <div
                        style={{
                          marginBottom: 16,
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                            userSelect: 'none',
                          }}
                          onClick={() => {
                            if (!isNFTBalancesIncluded) {
                              // showing
                              Analytics.logEvent('click_show_nfts', undefined);
                            } else {
                              // hiding
                              Analytics.logEvent('click_hide_nfts', undefined);
                            }
                            setNFTBalancesIncluded(!isNFTBalancesIncluded);
                          }}
                        >
                          <Checkbox
                            checked={isNFTBalancesIncluded ?? false}
                            readOnly
                          />
                          <span
                            style={{
                              marginLeft: 6,
                              color: Colors.gray200,
                              fontSize: 14,
                              lineHeight: '20px',
                            }}
                          >
                            {t('Show NFTs')}
                          </span>
                        </div>
                      </div>

                      <AssetListCard>
                        {renderedTokenBalances.length > 0 ? (
                          <ul>
                            {renderedTokenBalances.map((item) => {
                              const key = `${item.symbol ?? item.name}-${
                                'tokenAddress' in item
                                  ? item.tokenAddress
                                  : 'native'
                              }`;
                              return (
                                <WalletBalanceItem
                                  key={key}
                                  tokenBalance={item}
                                  onClick={() => {
                                    Analytics.logEvent('click_balance_item', {
                                      name: item.name,
                                      symbol: item.symbol ?? undefined,
                                      platform: item.platform,
                                      address: item.tokenAddress ?? undefined,
                                    });
                                    setDetailModalVisible((prev) => !prev);
                                    setDetailModalParams({
                                      tokenBalance: item,
                                    });
                                  }}
                                />
                              );
                            })}
                          </ul>
                        ) : (
                          <EmptyBalance />
                        )}
                      </AssetListCard>
                    </div>
                  );
                } else {
                  return (
                    <div key={feedItem}>
                      <SectionTitle
                        style={{
                          marginTop: 12,
                          marginBottom: 12,
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <span className="title">{t('DeFi Protocols')}</span>
                        <InlineBadge>
                          {defis.length > 0
                            ? defis.length.toLocaleString()
                            : '-'}
                        </InlineBadge>
                      </SectionTitle>

                      <AssetListCard>
                        {defis.length > 0 ? (
                          <Collapse>
                            {defis.map((service) => {
                              const valuation = service.protocols.reduce(
                                (acc, v) => acc + v.netWorth,
                                0,
                              );
                              return (
                                <DeFiProtocolItem
                                  service={service}
                                  key={`${service.chain}-${service.serviceId}`}
                                  valuation={valuation}
                                  currentLanguage={currentLanguage}
                                  onClick={() => {
                                    setDetailModalVisible((prev) => !prev);
                                    setDetailModalParams({
                                      service,
                                    });
                                  }}
                                />
                              );
                            })}
                          </Collapse>
                        ) : (
                          <EmptyBalance />
                        )}
                      </AssetListCard>
                    </div>
                  );
                }
              })}
            </AnimatedTab>

            <AnimatedTab selected={currentTab === DashboardTabType.NFTs}>
              {!isNFTsInitialized ? (
                <Skeleton
                  style={{
                    width: '100%',
                    height: '300px',
                    borderRadius: '8px',
                  }}
                />
              ) : (
                <NFTListSection
                  nftAssets={nftAssets}
                  isMyProfile={isMyProfile}
                  user={user}
                  selectedNFT={selectedNFT}
                  setSelectedNFT={setSelectedNFT}
                />
              )}
            </AnimatedTab>

            <AnimatedTab selected={currentTab === DashboardTabType.Badges}>
              <BadgeListSection
                userId={user.id}
                selected={currentTab === DashboardTabType.Badges}
              />
            </AnimatedTab>
          </DashboardContent>
        </DashboardContentWrapper>
      </DashboardWrapper>

      <div style={{ width: '100%', height: 96 }} />
    </React.Fragment>
  );
};

export default DashboardMain;

const DashboardWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const TabContainer = styled.div`
  padding: 0 32px;

  @media (max-width: ${Breakpoints.Tablet}px) {
    padding: 0 24px;
  }

  @media (max-width: ${Breakpoints.Mobile}px) {
    padding: 0;
  }
`;

const DashboardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const DashboardContent = styled.div`
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  flex: 1;

  background: ${Colors.black};
  border: 2px solid ${Colors.gray700};
  border-radius: 16px;

  @media (max-width: ${Breakpoints.Tablet}px) {
    padding: 28px 0 0;
    border: 0;
    border-top: 0.4pt solid ${Colors.gray700};
    border-radius: 0;
  }

  @media (max-width: ${Breakpoints.Mobile}px) {
    padding-top: 20px;
  }

  & .tab-crypto {
    gap: 32px;
  }
`;
const TopSummaryContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 32px;

  @media (max-width: ${Breakpoints.Tablet}px) {
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

  @media (max-width: ${Breakpoints.Mobile}px) {
    padding: 12px;
  }

  & > ul {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
`;
const Collapse = styled.ul`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};
`;
