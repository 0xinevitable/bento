import { shortenAddress } from '@bento/common';
import { OpenSeaAsset, cachedAxios } from '@bento/core';
import clsx from 'clsx';
import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { Badge, Modal } from '@/components/system';

import { WalletBalance } from '@/dashboard/types/WalletBalance';
import { Colors } from '@/styles';

import { AssetMedia } from './AssetMedia';

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

type WalletsByPosition = { amount: number; address: string };

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

  const walletsWithBalance = useMemo<WalletsByPosition[]>(() => {
    let walletsByPosition: WalletsByPosition[] = [];

    if (tokenBalance?.type === 'nft' || !tokenBalance?.balances) {
      return walletsByPosition;
    }

    for (let wallet of tokenBalance.balances) {
      if (wallet.balance > 0) {
        walletsByPosition.push({
          amount: wallet.balance,
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
        <>
          <TokenHeader>
            <TokenImage src={tokenBalance.logo} />
            <TokenInformation>
              <TokenName>{tokenBalance.name}</TokenName>
              {tokenBalance.symbol !== null && (
                <TokenSymbol style={{ color: Colors.gray400 }}>
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
                    <AssetName
                      className="sys"
                      style={{
                        color: Colors.gray200,
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
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
                    <span className="sys field">Price</span>
                    <span className="sys value">
                      {priceChange !== null && (
                        <span
                          style={{
                            marginRight: 6,
                            color:
                              priceChange === 0
                                ? Colors.gray400
                                : priceChange < 0
                                ? '#ef4444'
                                : '#22c55e',
                          }}
                        >
                          {`${
                            priceChange < 0 ? '' : '+'
                          }${priceChange.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}%`}
                        </span>
                      )}

                      <span>
                        {`$${tokenBalance.price.toLocaleString(undefined, {
                          maximumSignificantDigits: 6,
                        })}`}
                      </span>
                    </span>
                  </div>
                  {TVL !== null && (
                    <div>
                      <span className="sys field">TVL</span>
                      <span className="sys value">{`$${TVL.toLocaleString()}`}</span>
                    </div>
                  )}
                  <div>
                    <span className="sys field">Type</span>
                    <span className="sys value">
                      {typeof tokenBalance.tokenAddress === 'undefined'
                        ? 'Native'
                        : 'Token'}
                    </span>
                  </div>
                </FungibleTokenTable>
                <AllocationSection>
                  <AllocationWalletList>
                    {walletsWithBalance.map((wallet) => {
                      return (
                        <li
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          key={`${
                            tokenBalance.tokenAddress || tokenBalance.symbol
                          }-${wallet.address}`}
                        >
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 8,
                              fontSize: 17,
                              fontWeight: 500,
                            }}
                          >
                            <TokenIcon src={tokenBalance.logo} />
                            <span
                              className="sys"
                              style={{ color: Colors.gray100 }}
                            >
                              {wallet.amount.toLocaleString(undefined, {
                                maximumFractionDigits: 6,
                              })}
                            </span>
                          </span>
                          <span
                            className="sys"
                            style={{ color: Colors.gray400, fontWeight: 600 }}
                          >
                            {shortenAddress(wallet.address)}
                          </span>
                        </li>
                      );
                    })}
                  </AllocationWalletList>
                </AllocationSection>
              </FungibleTokenInfo>

              <div className="w-full h-24 flex items-center justify-center">
                <p className="w-full text-gray-400 text-center">
                  More data coming soon...
                </p>
              </div>
            </>
          )}
        </>
      )}
    </OverlayWrapper>
  );
};

export default TokenDetailModal;

const OverlayWrapper = styled(Modal)`
  .modal-container {
    margin-top: 52px;

    padding: 16px;
    max-width: 800px;
    height: fit-content;
    width: 95vw;

    max-height: calc(100vh - 64px - 84px);
    overflow: scroll;

    display: flex;
    flex-direction: column;

    border: 1px solid ${Colors.gray600};
    border-radius: 8px;
    box-shadow: 0 4px 24px ${Colors.black};
    background-color: ${Colors.gray900};

    &,
    & > * {
      user-select: none;
    }
  }
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
  gap: 8px;

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
const AllocationWalletList = styled.ul`
  width: 100%;
  padding: 0 6px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`;
