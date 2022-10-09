import { shortenAddress } from '@bento/common';
import { OpenSeaAsset, cachedAxios } from '@bento/core';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Badge, Modal } from '@/components/system';

import { WalletBalance } from '@/dashboard/types/WalletBalance';

import { AssetMedia } from './AssetMedia';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

export type TokenDetailModalParams = {
  tokenBalance?: {
    symbol: string | null;
    name: string;
    logo?: string;
    tokenAddress?: string;
    balances: WalletBalance[];
    netWorth: number;
    amount: number;
    price: number;
    type?: 'nft';
    coinGeckoId?: string;
  };
};
type Props = TokenDetailModalParams & {
  visible?: boolean;
  onDismiss?: () => void;
};

type WalletPosition = 'wallet' | 'stake' | 'delegation';
type WalletsByPosition = Record<
  WalletPosition,
  { amount: number; address: string }[]
>;

export const TokenDetailModal: React.FC<Props> = ({
  visible: isVisible = false,
  onDismiss,
  tokenBalance,
}) => {
  const assets = useMemo<OpenSeaAsset[]>(
    () =>
      tokenBalance?.balances.flatMap((item) =>
        'assets' in item ? item.assets : [],
      ) ?? [],
    [tokenBalance],
  );

  const walletsByPosition = useMemo<WalletsByPosition>(() => {
    let walletsByPosition: WalletsByPosition = {
      wallet: [],
      stake: [],
      delegation: [],
    };

    if (tokenBalance?.type === 'nft' || !tokenBalance?.balances) {
      return walletsByPosition;
    }

    for (let wallet of tokenBalance.balances) {
      if (wallet.balance > 0) {
        const position =
          'staking' in wallet && wallet.staking ? 'stake' : 'wallet';
        walletsByPosition[position].push({
          amount: wallet.balance,
          address: wallet.walletAddress,
        });
      }
      if ('delegations' in wallet && wallet.delegations > 0) {
        walletsByPosition.delegation.push({
          amount: wallet.delegations,
          address: wallet.walletAddress,
        });
      }
    }

    return walletsByPosition;
  }, [tokenBalance]);

  const [TVL, setTVL] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number | null>(null);
  useEffect(() => {
    if (!tokenBalance?.coinGeckoId) {
      setTVL(null);
      setPriceChange(null);
      return;
    }

    const url = `https://api.coingecko.com/api/v3/coins/${tokenBalance.coinGeckoId}?tickers=false&market_data=true&community_data=false&developer_data=false`;

    cachedAxios.get(url).then(({ data }: any) => {
      setTVL(data.market_data?.total_value_locked?.usd ?? null);
      setPriceChange(data.market_data?.price_change_percentage_24h ?? null);
    });
  }, [tokenBalance]);

  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      {!tokenBalance ? null : (
        <Content>
          <TokenHeader>
            <TokenImage src={tokenBalance.logo} />
            <TokenInformation>
              <TokenName>{tokenBalance.name}</TokenName>
              {tokenBalance.symbol !== null && (
                <TokenSymbol className="text-gray-400">
                  {`$${tokenBalance.symbol}`}
                </TokenSymbol>
              )}
            </TokenInformation>
          </TokenHeader>

          {tokenBalance.type === 'nft' ? (
            <AssetList>
              {assets.map((asset) => {
                const isVideo =
                  !!asset.animation_url ||
                  asset.image_url?.toLowerCase()?.endsWith('.mp4') ||
                  false;

                return (
                  <AssetListItem key={asset.id}>
                    <AssetMedia
                      src={
                        !isVideo
                          ? asset.image_url || asset.collection.image_url
                          : asset.animation_url
                      }
                      poster={
                        asset.image_url ||
                        asset.image_preview_url ||
                        asset.collection.image_url
                      }
                      isVideo={isVideo}
                    />
                    <AssetName className="text-sm text-gray-400">
                      {asset.name || `#${asset.token_id}`}
                    </AssetName>
                  </AssetListItem>
                );
              })}
            </AssetList>
          ) : (
            <>
              <FungibleTokenInfo>
                <FungibleTokenTable>
                  <div>
                    <span className="field">Price</span>
                    <span className="value">
                      {priceChange !== null && (
                        <span
                          className={clsx(
                            'mr-1 text-sm font-semibold',
                            priceChange === 0
                              ? 'text-gray-400'
                              : priceChange < 0
                              ? 'text-red-400'
                              : 'text-green-400',
                          )}
                        >
                          {`${
                            priceChange < 0 ? '' : '+'
                          }${priceChange.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}%`}
                        </span>
                      )}

                      {`$${tokenBalance.price.toLocaleString(undefined, {
                        maximumSignificantDigits: 6,
                      })}`}
                    </span>
                  </div>
                  {TVL !== null && (
                    <div>
                      <span className="field">TVL</span>
                      <span className="value">{`$${TVL.toLocaleString()}`}</span>
                    </div>
                  )}
                  <div>
                    <span className="field">Type</span>
                    <span className="value">
                      {typeof tokenBalance.tokenAddress === 'undefined'
                        ? 'Native'
                        : 'Token'}
                    </span>
                  </div>
                </FungibleTokenTable>
                <AllocationSection>
                  {(['wallet', 'stake', 'delegation'] as const).map(
                    (position) => {
                      const wallets = walletsByPosition[position];
                      if (!wallets.length) {
                        return null;
                      }

                      const total = wallets.reduce(
                        (acc, wallet) => acc + wallet.amount,
                        0,
                      );
                      return (
                        <li key={position}>
                          <AllocationSectionTitle>
                            <InlineBadge>{capitalize(position)}</InlineBadge>

                            <PositionRatio>
                              {`${(
                                (total / tokenBalance.amount) *
                                100
                              ).toLocaleString()}%`}
                            </PositionRatio>
                          </AllocationSectionTitle>
                          <AllocationWalletList>
                            {walletsByPosition[position].map((wallet) => (
                              <li
                                className="w-full justify-between flex items-center"
                                key={`${
                                  tokenBalance.tokenAddress ||
                                  tokenBalance.symbol
                                }-${wallet.address}`}
                              >
                                <span className="flex items-center gap-2 font-semibold text-lg">
                                  <TokenIcon src={tokenBalance.logo} />
                                  {wallet.amount.toLocaleString(undefined, {
                                    maximumFractionDigits: 6,
                                  })}
                                </span>
                                <span className="text-gray-400">
                                  {shortenAddress(wallet.address)}
                                </span>
                              </li>
                            ))}
                          </AllocationWalletList>
                        </li>
                      );
                    },
                  )}
                </AllocationSection>
              </FungibleTokenInfo>

              <div className="w-full h-24 flex items-center justify-center">
                <p className="w-full text-gray-400 text-center">
                  More data coming soon...
                </p>
              </div>
            </>
          )}
        </Content>
      )}
    </OverlayWrapper>
  );
};

export default TokenDetailModal;

const OverlayWrapper = styled(Modal)`
  .modal-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 52px;

    &,
    & > * {
      user-select: none;
    }
  }
`;
const Content = styled.div`
  padding: 16px;
  max-width: 800px;
  height: 100%;
  width: 95vw;

  max-height: calc(100vh - 64px - 84px);
  overflow: scroll;

  display: flex;
  flex-direction: column;

  border: 1px solid #323232;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.45);
`;
const TokenHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TokenImage = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
`;
const TokenIcon = styled(TokenImage)`
  width: 28px;
  height: 28px;
`;

const TokenInformation = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`;
const TokenName = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: white;
  line-height: 1;
`;
const TokenSymbol = styled.span`
  margin-top: 6px;
  font-size: 18px;
  line-height: 1;
`;

const AssetList = styled.ul`
  margin-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  padding-top: 16px;

  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const AssetListItem = styled.li`
  width: 182px;

  display: flex;
  flex-direction: column;

  @media (max-width: 840px) {
    width: calc(33% - 6px);
  }

  @media (max-width: 664px) {
    width: calc(50% - 6px);
  }
`;
const AssetName = styled.span`
  margin-top: 4px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const FungibleTokenInfo = styled.div`
  margin-top: 16px;

  margin-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 16px;

  width: 100%;
  display: flex;
  color: white;

  & > div:first-of-type {
    margin-right: 32px;
  }

  @media (max-width: 600px) {
    flex-direction: column;

    & > div:first-of-type {
      margin-right: 0;
      margin-bottom: 30px;
    }
  }
`;
const FungibleTokenTable = styled.div`
  flex: 1;
  font-size: 18.5px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  & > div {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  span.field {
    color: rgba(255, 255, 255, 0.65);
  }

  span.value {
    color: rgba(255, 255, 255, 0.95);
  }
`;
const AllocationSection = styled.ul`
  width: 100%;

  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const AllocationSectionTitle = styled.h4`
  display: flex;
  align-items: center;
`;
const InlineBadge = styled(Badge)`
  padding: 6px;
  padding-bottom: 5px;
  display: inline-flex;
  font-size: 18px;
  backdrop-filter: none;
`;
const PositionRatio = styled.span`
  margin-top: 2px;
  margin-left: 6px;

  font-size: 22px;
  line-height: 1;
  color: rgba(255, 255, 255, 0.4);
`;
const AllocationWalletList = styled.ul`
  margin-top: 12px;
  width: 100%;
  padding: 0 6px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;
