import { OpenSeaAsset } from '@bento/client';
import { useMemo } from 'react';
import styled from 'styled-components';

import { Modal } from '@/components/Modal';
import { AssetMedia } from '@/dashboard/components/AssetMedia';

export type NFTDetailModalParams = {
  asset: OpenSeaAsset | null;
};
type Props = NFTDetailModalParams & {
  visible?: boolean;
  onDismiss?: () => void;
};

export const NFTDetailModal: React.FC<Props> = ({
  visible: isVisible = false,
  onDismiss,
  asset,
}) => {
  const [isVideo, imageURL] = useMemo(
    () => [
      !!asset?.animation_url ||
        asset?.image_url?.toLowerCase()?.endsWith('.mp4') ||
        false,
      asset?.image_url ||
        asset?.image_preview_url ||
        asset?.collection.image_url,
    ],
    [asset],
  );

  return (
    <OverlayWrapper
      visible={isVisible}
      onDismiss={onDismiss}
      transition={{ ease: 'linear' }}
    >
      <Content>
        {!!asset && (
          <>
            <AssetListItem key={asset.id}>
              <AssetMedia
                src={!isVideo ? imageURL : asset.animation_url}
                poster={imageURL}
                isVideo={isVideo}
              />
            </AssetListItem>

            <TokenHeader>
              <TokenName>{asset.name || `#${asset.id}`}</TokenName>

              <CollectionRow>
                <CollectionImage src={asset.collection.image_url} />
                <CollectionName>{asset.collection.name}</CollectionName>
              </CollectionRow>
            </TokenHeader>
          </>
        )}
      </Content>
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
  max-width: 32rem;
  height: 100%;
  width: 95vw;

  max-height: calc(100vh - 64px - 84px);
  overflow: scroll;

  display: flex;

  border: 1px solid #323232;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.45);
`;

const AssetListItem = styled.div`
  width: 45%;

  display: flex;
  flex-direction: column;
`;

const TokenHeader = styled.div`
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);

  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TokenName = styled.h2`
  margin-top: 12px;

  font-size: 18px;
  font-weight: bold;
  color: white;
  line-height: 1;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CollectionRow = styled.div`
  margin-top: 8px;

  display: flex;
  align-items: center;
  gap: 6px;
`;
const CollectionImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background-color: black;
`;
const CollectionName = styled.span`
  font-size: 14.8px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.75);

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;
