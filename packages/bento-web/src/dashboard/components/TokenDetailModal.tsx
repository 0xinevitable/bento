import { OpenSeaAsset } from '@bento/client';
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { Modal } from '@/components/Modal';
import { Portal } from '@/components/Portal';

import { WalletBalance } from '../types/WalletBalance';

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
  };
};
type Props = TokenDetailModalParams & {
  visible?: boolean;
  onDismiss?: () => void;
};

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
                  asset.image_url.toLowerCase().endsWith('.mp4');

                return (
                  <AssetListItem key={asset.id}>
                    {!isVideo ? (
                      <AssetImage src={asset.image_url} />
                    ) : (
                      <AssetVideo
                        src={asset.animation_url}
                        poster={asset.image_url || asset.image_preview_url}
                        width={98}
                        height={98}
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    )}
                    <AssetName className="text-sm text-gray-400">
                      {asset.name || `#${asset.id}`}
                    </AssetName>
                  </AssetListItem>
                );
              })}
            </AssetList>
          ) : (
            <div className="w-full h-24 flex items-center justify-center">
              <p className="w-full text-gray-400 text-center">
                More data coming soon...
              </p>
            </div>
          )}
        </Content>
      )}
    </OverlayWrapper>
  );
};

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
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
`;

const TokenInformation = styled.div`
  margin-left: 16px;
  display: flex;
  flex-direction: column;
`;
const TokenName = styled.h2`
  font-size: 18px;
  font-weight: bold;
  color: white;
`;
const TokenSymbol = styled.span`
  font-size: 14px;
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

  @media screen and (max-width: 840px) {
    width: calc(33% - 6px);
  }

  @media screen and (max-width: 664px) {
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
const assetMediaStyle = css`
  width: 100%;
  aspect-ratio: 1;

  object-fit: cover;
  border-radius: 8px;
  background-color: black;
`;
const AssetImage = styled.img`
  ${assetMediaStyle}
`;
const AssetVideo = styled.video`
  ${assetMediaStyle}
`;
