import { Wallet } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AnimatedTab } from '@/components/AnimatedTab';
import { Checkbox, Skeleton } from '@/components/system';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import { useDeFis } from '@/dashboard/hooks/useDeFis';
import { useNFTBalances } from '@/dashboard/hooks/useNFTBalances';
import { useWalletBalances } from '@/dashboard/hooks/useWalletBalances';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { WalletBalance } from '@/dashboard/types/WalletBalance';
import { Metadata } from '@/defi/klaytn/constants/metadata';
import { useProfile } from '@/profile/hooks/useProfile';
import { Colors } from '@/styles';
import { Analytics, FeatureFlags } from '@/utils';

import { CollapsePanel } from './components/CollapsePanel';
import { DeFiStakingItem } from './components/DeFiStakingItem';
import { EmptyBalance } from './components/EmptyBalance';
import { InlineBadge } from './components/InlineBadge';
import { Tab } from './components/Tab';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import { TokenDetailModalParams } from './components/TokenDetailModal';
import { KlaytnNFTAsset, useKlaytnNFTs } from './hooks/useKlaytnNFTs';
import { AssetRatioSection } from './sections/AssetRatioSection';
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
  const { t, i18n } = useTranslation('dashboard');
  const currentLanguage = i18n.resolvedLanguage || i18n.language || 'en';

  const { profile, revalidateProfile } = useProfile({ type: 'MY_PROFILE' });
  const { balances: walletBalances, jsonKey: walletBalancesJSONKey } =
    useWalletBalances({ wallets });
  const { balances: NFTBalances, jsonKey: nftBalancesJSONKey } = useNFTBalances(
    { wallets },
  );
  const { klaytnNFTs } = useKlaytnNFTs(wallets);

  const nftAssets = useMemo<(OpenSeaAsset | KlaytnNFTAsset)[]>(() => {
    return [
      ...klaytnNFTs,
      ...(NFTBalances?.flatMap((item) =>
        'assets' in item ? item.assets : [],
      ) ?? []),
    ];
  }, [nftBalancesJSONKey, klaytnNFTs]);

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
  }, [walletBalancesJSONKey, nftBalancesJSONKey]);
  const tokenBalancesJSONKey = JSON.stringify(tokenBalances);

  const [isNFTBalancesIncluded, setNFTBalancesIncluded] =
    useLocalStorage<boolean>('@is-nfts-shown-v1', true);

  const renderedTokenBalances = useMemo(() => {
    if (isNFTBalancesIncluded) {
      return tokenBalances;
    }
    return tokenBalances.filter((v) => v.type !== 'nft');
  }, [isNFTBalancesIncluded, tokenBalancesJSONKey]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalancesJSONKey],
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

  const { defis, defisJSONKey } = useDeFis(wallets);
  const defiStakesByProtocol = useMemo(
    () => groupBy(defis, 'protocol'),
    [defisJSONKey],
  );

  const [defiMetadata, setDefiMetadata] = useState<Record<
    string,
    Metadata
  > | null>(null);
  useEffect(() => {
    if (!!defiMetadata) {
      return;
    }
    import('../defi/klaytn/constants/metadata').then((v) =>
      setDefiMetadata(v.KLAYTN_DEFI_METADATA),
    );
  }, [defiStakesByProtocol]);

  return (
    <React.Fragment>
      <div style={{ width: '100%', height: 32 }} />

      <DashboardWrapper>
        <ProfileContainer>
          <div className="sticky">
            <ProfileSummarySection
              profile={profile}
              revalidateProfile={revalidateProfile}
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
                  tokenBalances={tokenBalances}
                />

                <WalletListSection
                  onClickAddWallet={() =>
                    setAddWalletModalVisible((prev) => !prev)
                  }
                />
              </TopSummaryContainer>

              <div>
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

                <div className="mb-4 w-full flex items-center">
                  <div
                    className="flex items-center cursor-pointer select-none"
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
                    <span className="ml-[6px] text-white/80 text-sm">
                      {t('Show NFTs')}
                    </span>
                  </div>
                </div>

                <AssetListCard>
                  {renderedTokenBalances.length > 0 ? (
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

              {FeatureFlags.isKlaytnDeFiEnabled && (
                <div>
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
                      {defis.length > 0 ? defis.length.toLocaleString() : '-'}
                    </InlineBadge>
                  </SectionTitle>

                  <AssetListCard>
                    {defis.length > 0 ? (
                      <Collapse>
                        {Object.entries(defiStakesByProtocol).map(
                          ([protocol, defiProtocols]) => {
                            const valuation = defiProtocols.reduce(
                              (acc, v) => acc + v.valuation.total,
                              0,
                            );
                            return (
                              <CollapsePanel
                                title={t(`protocol-${protocol}`)}
                                metadata={defiMetadata?.[protocol]}
                                count={defiProtocols.length}
                                key={protocol}
                                valuation={valuation}
                                currentLanguage={currentLanguage}
                              >
                                <ul>
                                  {defiProtocols.map((item) => (
                                    <DeFiStakingItem
                                      // FIXME: group stats with different wallets...
                                      key={`${item.type}-${item.address}-${item.walletAddress}`}
                                      protocol={item}
                                    />
                                  ))}
                                </ul>
                              </CollapsePanel>
                            );
                          },
                        )}
                      </Collapse>
                    ) : (
                      <EmptyBalance />
                    )}
                  </AssetListCard>
                </div>
              )}
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
                  isMyProfile={true}
                  profile={profile}
                  revalidateProfile={revalidateProfile}
                />
              )}
            </AnimatedTab>

            <AnimatedTab selected={currentTab === DashboardTabType.Badges}>
              <span className="my-8 text-center text-white/90 font-bold">
                Coming Soon!
              </span>
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
