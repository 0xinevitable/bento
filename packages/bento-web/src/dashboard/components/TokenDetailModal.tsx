import { OpenSeaAsset } from '@bento/client';
import clsx from 'clsx';
import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { Modal } from '@/components/Modal';
import { Portal } from '@/components/Portal';

import { WalletBalance } from '../types/balance';

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
    <Portal>
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

            {tokenBalance.type === 'nft' && (
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
            )}
          </Content>
        )}
      </OverlayWrapper>
    </Portal>
  );
};

const OverlayWrapper = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;

  &,
  & > * {
    user-select: none;
  }
`;
const Content = styled.div`
  padding: 16px;
  max-width: 800px;
  width: 95vw;

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
`;
const AssetName = styled.span`
  margin-top: 4px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const assetMediaStyle = css`
  width: 182px;
  height: 182px;
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
