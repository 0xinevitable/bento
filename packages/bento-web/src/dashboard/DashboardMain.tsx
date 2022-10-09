import { Wallet } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { AnimatedTab } from '@/components/AnimatedTab';
import { Badge, Checkbox, Skeleton } from '@/components/system';
import { useLocalStorage } from '@/hooks/useLocalStorage';

import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { WalletBalance } from '@/dashboard/types/WalletBalance';
import { useNFTBalances } from '@/dashboard/utils/useNFTBalances';
import { useWalletBalances } from '@/dashboard/utils/useWalletBalances';
import { DeFiStaking } from '@/defi/types/staking';
import { useProfile } from '@/profile/hooks/useProfile';
import { Colors } from '@/styles';
import { Analytics } from '@/utils';

import { DeFiStakingItem } from './components/DeFiStakingItem';
import { EmptyBalance } from './components/EmptyBalance';
import { Tab } from './components/Tab';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import { TokenDetailModalParams } from './components/TokenDetailModal';
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
  const { t } = useTranslation('dashboard');
  const { profile, revalidateProfile } = useProfile({ type: 'MY_PROFILE' });
  const { balances: walletBalances, jsonKey: walletBalancesJSONKey } =
    useWalletBalances({ wallets });
  const { balances: NFTBalances, jsonKey: nftBalancesJSONKey } = useNFTBalances(
    { wallets },
  );

  const nftAssets = useMemo<OpenSeaAsset[]>(
    () =>
      NFTBalances?.flatMap((item) => ('assets' in item ? item.assets : [])) ??
      [],
    [nftBalancesJSONKey],
  );

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

  const defis = mockedDeFis;

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
                <ul>
                  {defis.map((defiProtocol) => (
                    <DeFiStakingItem
                      key={defiProtocol.address}
                      protocol={defiProtocol}
                    />
                  ))}
                </ul>
              </AssetListCard>
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

const SectionTitle = styled.h3`
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

const mockedDeFis = [
  {
    type: 'kks_lp',
    address: '0x1cE54D1DE574C620838a19294fef1aC70fC612a3',
    tokens: [
      {
        symbol: 'KLAY',
        decimals: 18,
        name: 'Klaytn',
        logo: '/assets/icons/klaytn.png',
        coinGeckoId: 'klay-token',
      },
      {
        symbol: 'KSP',
        name: 'KlaySwap Protocol',
        decimals: 18,
        address: '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654',
        coinGeckoId: 'klayswap-protocol',
        logo: '/assets/icons/klaytn/0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654.png',
      },
    ],
    wallet: {
      value: 0,
      lpAmount: 113431473649147700,
    },
    staked: {
      value: 0,
      lpAmount: 0,
    },
    rewards: {
      tokenAmounts: {
        '0x4fa62f1f404188ce860c8f0041d6ac3765a72e67': 0,
      },
    },
    unstake: null,
  },
  {
    type: 'kks_lp',
    address: '0x22e3aC1e6595B64266e0b062E01faE31d9cdD578',
    tokens: [
      {
        symbol: 'KSD',
        name: 'Kokoa Stable Dollar',
        decimals: 18,
        address: '0x4fa62f1f404188ce860c8f0041d6ac3765a72e67',
        coinGeckoId: 'kokoa-stable-dollar',
        logo: '/assets/icons/klaytn/0x4fa62f1f404188ce860c8f0041d6ac3765a72e67.png',
      },
      {
        symbol: 'KDAI',
        name: 'Klaytn Dai',
        decimals: 18,
        address: '0x5c74070fdea071359b86082bd9f9b3deaafbe32b',
        coinGeckoId: 'klaytn-dai',
        logo: '/assets/icons/klaytn/0x5c74070fdea071359b86082bd9f9b3deaafbe32b.png',
      },
      {
        symbol: 'oUSDC',
        name: 'Orbit Bridge Klaytn USDC',
        decimals: 6,
        address: '0x754288077d0ff82af7a5317c7cb8c444d421d103',
        coinGeckoId: 'orbit-bridge-klaytn-usdc',
        logo: '/assets/icons/klaytn/0x754288077d0ff82af7a5317c7cb8c444d421d103.png',
      },
      {
        symbol: 'oUSDT',
        name: 'Orbit Bridge Klaytn USD Tether',
        decimals: 6,
        address: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
        coinGeckoId: 'orbit-bridge-klaytn-usd-tether',
        logo: '/assets/icons/klaytn/0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167.png',
      },
    ],
    wallet: {
      value: 0,
      lpAmount: 5428217695786448000,
    },
    staked: {
      value: 0,
      lpAmount: 0,
    },
    rewards: {
      tokenAmounts: {
        '0x4fa62f1f404188ce860c8f0041d6ac3765a72e67': 0,
      },
    },
    unstake: null,
  },
  {
    type: 'ks_g',
    address: '0x2f3713f388bc4b8b364a7a2d8d57c5ff4e054830',
    tokens: [
      {
        symbol: 'KSP',
        name: 'KlaySwap Protocol',
        decimals: 18,
        address: '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654',
        coinGeckoId: 'klayswap-protocol',
        logo: '/assets/icons/klaytn/0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654.png',
      },
    ],
    wallet: null,
    staked: {
      tokenAmounts: {
        '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654': 1,
      },
    },
    rewards: 'unavailable',
    unstake: null,
  },
  {
    type: 'ks_l_s',
    address: '0x4b419986e15018e6dc1c9dab1fa4824d8e2e06b5',
    wallet: null,
    tokens: [
      {
        symbol: 'oUSDT',
        name: 'Orbit Bridge Klaytn USD Tether',
        decimals: 6,
        address: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
        coinGeckoId: 'orbit-bridge-klaytn-usd-tether',
        logo: '/assets/icons/klaytn/0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167.png',
      },
    ],
    staked: {
      lpAmount: 3.000307,
    },
    rewards: {
      tokenAmounts: {
        '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654': 0,
      },
    },
    unstake: null,
  },
  {
    type: 'ks_lp',
    address: '0xc320066b25b731a11767834839fe57f9b2186f84',
    tokens: [
      {
        symbol: 'oUSDT',
        name: 'Orbit Bridge Klaytn USD Tether',
        decimals: 6,
        address: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
        coinGeckoId: 'orbit-bridge-klaytn-usd-tether',
        logo: '/assets/icons/klaytn/0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167.png',
      },
      {
        symbol: 'KDAI',
        name: 'Klaytn Dai',
        decimals: 18,
        address: '0x5c74070fdea071359b86082bd9f9b3deaafbe32b',
        coinGeckoId: 'klaytn-dai',
        logo: '/assets/icons/klaytn/0x5c74070fdea071359b86082bd9f9b3deaafbe32b.png',
      },
    ],
    wallet: null,
    staked: {
      lpAmount: 1.9774791e-11,
      tokenAmounts: {
        '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167': 19.940858,
        '0x5c74070fdea071359b86082bd9f9b3deaafbe32b': 19.983818043521016,
      },
    },
    rewards: 'unavailable',
    unstake: null,
  },
  {
    type: 'kks_g',
    address: '0xc75456755d68058bf182bcd41c6d9650db4ce89e',
    tokens: [
      {
        symbol: 'KOKOS',
        name: 'i4i Finance',
        decimals: 18,
        address: '0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560',
        coinGeckoId: 'i4i-finance',
        logo: '/assets/icons/klaytn/0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560.png',
      },
    ],
    wallet: null,
    staked: {
      tokenAmounts: {
        '0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560': 3.0058105862502957,
      },
    },
    rewards: {
      tokenAmounts: {
        '0x4fa62f1f404188ce860c8f0041d6ac3765a72e67': 0.000119897892664235,
      },
    },
    unstake: {
      claimable: {
        tokenAmounts: {
          '0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560': 0,
        },
      },
      pending: {
        tokenAmounts: {
          '0xcd670d77f3dcab82d43dff9bd2c4b87339fb3560': 1,
        },
      },
    },
  },
  {
    type: 'ks_l_s',
    address: '0xe4c3f5454a752bddda18ccd239bb1e00ca42d371',
    wallet: null,
    tokens: [
      {
        symbol: 'KLAY',
        decimals: 18,
        name: 'Klaytn',
        logo: '/assets/icons/klaytn.png',
        coinGeckoId: 'klay-token',
      },
    ],
    staked: {
      lpAmount: 20.00115239198455,
    },
    rewards: {
      tokenAmounts: {
        '0xc6a2ad8cc6e4a7e08fc37cc5954be07d499e7654': 0,
      },
    },
    unstake: null,
  },
  {
    type: 'kstn_n_hno',
    address: '0xE33337cb6FbB68954fe1c3fDe2b21F56586632cD',
    tokens: [
      {
        symbol: 'KLAY',
        decimals: 18,
        name: 'Klaytn',
        logo: '/assets/icons/klaytn.png',
        coinGeckoId: 'klay-token',
      },
    ],
    wallet: null,
    staked: {
      tokenAmounts: {
        '0x0000000000000000000000000000000000000000': 0.4001897370838342,
      },
    },
    rewards: 'unavailable',
    unstake: {
      claimable: 'unavailable',
      pending: {
        tokenAmounts: {
          '0x0000000000000000000000000000000000000000': 1.2,
        },
      },
    },
  },
  {
    type: 'kstn_n_ked',
    address: '0xeFFa404DaC6ba720002974C54d57B20E89B22862',
    tokens: [
      {
        symbol: 'KLAY',
        decimals: 18,
        name: 'Klaytn',
        logo: '/assets/icons/klaytn.png',
        coinGeckoId: 'klay-token',
      },
    ],
    wallet: null,
    staked: {
      tokenAmounts: {
        '0x0000000000000000000000000000000000000000': 0.5001874572193913,
      },
    },
    rewards: 'unavailable',
    unstake: {
      claimable: 'unavailable',
      pending: {
        tokenAmounts: {
          '0x0000000000000000000000000000000000000000': 0,
        },
      },
    },
  },
  {
    type: 'kstn_n_fsn',
    address: '0x962CDB28e662B026dF276E5EE7FDf13a06341d68',
    tokens: [
      {
        symbol: 'KLAY',
        decimals: 18,
        name: 'Klaytn',
        logo: '/assets/icons/klaytn.png',
        coinGeckoId: 'klay-token',
      },
    ],
    wallet: null,
    staked: {
      tokenAmounts: {
        '0x0000000000000000000000000000000000000000': 2.5009774817948993,
      },
    },
    rewards: 'unavailable',
    unstake: {
      claimable: 'unavailable',
      pending: {
        tokenAmounts: {
          '0x0000000000000000000000000000000000000000': 0,
        },
      },
    },
  },
] as any as DeFiStaking[];
