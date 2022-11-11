import { Wallet } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import styled from '@emotion/styled';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';

import { AnimatedTab } from '@/components/AnimatedTab';
import { Checkbox, Skeleton } from '@/components/system';
import { useLazyEffect } from '@/hooks/useLazyEffect';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import { useProtocols } from '@/dashboard/hooks/useDeFis';
import { useNFTBalances } from '@/dashboard/hooks/useNFTBalances';
import { useWalletBalances } from '@/dashboard/hooks/useWalletBalances';
import {
  DashboardTokenBalance,
  WalletBalance,
} from '@/dashboard/types/TokenBalance';
import { UserProfile } from '@/profile/types/UserProfile';
import { Colors } from '@/styles';
import { Analytics } from '@/utils';

import { CollapsePanel } from './components/CollapsePanel';
import { DeFiStakingItem } from './components/DeFiStakingItem';
import { EmptyBalance } from './components/EmptyBalance';
import { InlineBadge } from './components/InlineBadge';
import { Tab } from './components/Tab';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import { TokenDetailModalParams } from './components/TokenDetailModal';
import { KlaytnNFTAsset, useKlaytnNFTs } from './hooks/useKlaytnNFTs';
import { AssetRatioSection } from './sections/AssetRatioSection';
import { BadgeListSection } from './sections/BadgeListSection';
import { NFTListSection } from './sections/NFTListSection';
import { ProfileSummarySection } from './sections/ProfileSummarySection';
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
  wallets: Wallet[];
  profile: UserProfile;
  imageToken: string;
  revalidateProfile: () => Promise<void>;
  revalidateWallets: () => Promise<Wallet[] | undefined>;
  setAddWalletModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenDetailModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenDetailModalParams: React.Dispatch<
    React.SetStateAction<TokenDetailModalParams>
  >;
};

export const DashboardMain: React.FC<DashboardMainProps> = ({
  isMyProfile,
  wallets,
  profile,
  imageToken,
  revalidateProfile,
  revalidateWallets,
  setAddWalletModalVisible,
  setTokenDetailModalVisible,
  setTokenDetailModalParams,
}) => {
  const { t, i18n } = useTranslation('dashboard');
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  const { balances: walletBalances } = useWalletBalances({ wallets });
  const { balances: nftBalances } = useNFTBalances({
    wallets,
  });
  const { klaytnNFTs } = useKlaytnNFTs(wallets);

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

  const netWorthInUSD = useMemo(
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

  const { defis } = useProtocols(wallets);

  const netWorthInUSDOnlyDeFi = useMemo(
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
      netWorthInUSDOnlyDeFi > netWorthInUSD
        ? ['DEFI', 'WALLET']
        : ['WALLET', 'DEFI'],
    [netWorthInUSDOnlyDeFi, netWorthInUSD],
  );

  return (
    <React.Fragment>
      <div style={{ width: '100%', height: 32 }} />

      <DashboardWrapper>
        <ProfileContainer>
          <div className="sticky">
            <ProfileSummarySection
              profile={profile}
              revalidateProfile={revalidateProfile}
              isMyProfile={isMyProfile}
              imageToken={imageToken}
            />
          </div>
        </ProfileContainer>

        <DashboardContentWrapper>
          <Tab
            current={currentTab}
            onChange={setCurrentTab}
            items={DASHBOARD_TAB_ITEMS}
          />
          <DashboardContent>
            <AnimatedTab
              className="tab-crypto"
              selected={currentTab === DashboardTabType.Crypto}
            >
              <TopSummaryContainer>
                <AssetRatioSection
                  netWorthInUSD={netWorthInUSD}
                  netWorthInUSDOnlyDeFi={netWorthInUSDOnlyDeFi}
                  tokenBalances={tokenBalances}
                  // defiStakesByProtocol={defiStakesByProtocol}
                />

                <WalletListSection
                  isMyProfile={isMyProfile}
                  wallets={wallets}
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
                                    setTokenDetailModalParams({
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
                        <span className="title">{t('DeFi Staking')}</span>
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
                                <CollapsePanel
                                  title={service.name}
                                  count={service.protocols.reduce(
                                    (acc, v) => acc + v.accounts.length,
                                    0,
                                  )}
                                  // FIXME: Use service id
                                  key={service.name}
                                  valuation={valuation}
                                  currentLanguage={currentLanguage}
                                >
                                  <ul>
                                    {service.protocols.map((protocol) => (
                                      // <DeFiStakingItem
                                      //   // FIXME: group stats with different wallets...
                                      //   // FIXME: Use protocol id in key
                                      //   key={`${item.address || 'gov'}-${
                                      //     item.account
                                      //   }`}
                                      //   protocol={item}
                                      // />
                                      <React.Fragment
                                        key={
                                          typeof protocol.info.name === 'string'
                                            ? protocol.info.name
                                            : protocol.info.name.en
                                        }
                                      >
                                        {protocol.accounts.map((account) => (
                                          <DeFiStakingItem
                                            info={protocol.info}
                                            protocol={account}
                                          />
                                        ))}
                                      </React.Fragment>
                                    ))}
                                  </ul>
                                </CollapsePanel>
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
                  selected={currentTab === DashboardTabType.NFTs}
                  isMyProfile={isMyProfile}
                  profile={profile}
                  revalidateProfile={revalidateProfile}
                />
              )}
            </AnimatedTab>

            <AnimatedTab selected={currentTab === DashboardTabType.Badges}>
              <BadgeListSection
                userId={profile.user_id}
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
  display: flex;
  width: 100%;
  gap: 32px;

  @media (max-width: 1300px) {
    gap: 28px;
  }

  @media (max-width: 1200px) {
    gap: 24px;
  }

  @media (max-width: 880px) {
    flex-direction: column;
    gap: 32px;
  }
`;
const ProfileContainer = styled.div`
  &,
  & > div.sticky {
    width: 400px;

    @media (max-width: 1200px) {
      width: 360px;
    }
  }

  @media (max-width: 880px) {
    width: 100%;

    & div.profile-summary {
      height: 360px;
      padding-bottom: unset;
    }
  }

  & > div.sticky {
    position: fixed;

    @media (max-width: 880px) {
      position: static;
      width: unset;
    }
  }
`;
const DashboardContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const DashboardContent = styled.div`
  padding: 27px 33px;
  display: flex;
  flex-direction: column;
  flex: 1;

  background: ${Colors.black};
  border: 2px solid ${Colors.gray700};
  border-radius: 16px;

  @media (max-width: 1240px) {
    padding: 24px 0 0;
    border: 0;
  }

  & .tab-crypto {
    gap: 32px;
  }
`;
const TopSummaryContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 32px;

  @media (max-width: 1300px) {
    gap: 24px;
  }

  @media (max-width: 1200px) {
    gap: 20px;
  }

  @media (max-width: 1110px) {
    flex-direction: column;
    gap: 32px;
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

  @media (max-width: 400px) {
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
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionTitle = styled.h3`
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};
`;
