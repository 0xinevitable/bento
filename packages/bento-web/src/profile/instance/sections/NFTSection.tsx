import { OpenSeaAsset } from '@bento/client';
import { AssetMedia } from '@bento/client/components';
import { Colors } from '@bento/client/styles';
import { Analytics } from '@bento/client/utils';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { UserProfile } from '../../types/UserProfile';
import { Empty } from './Empty';
import { NFTDetailModal } from './NFTDetailModal';

type Props = {
  selected: boolean;
  nftAssets: OpenSeaAsset[];
  profile: UserProfile | null;
  isMyProfile: boolean;
  onClickSetAsProfile: (assetImage: string) => void;
};

export const NFTSection: React.FC<Props> = ({
  nftAssets,
  selected,
  profile,
  isMyProfile,
  onClickSetAsProfile,
}) => {
  const [selectedNFT, setSelectedNFT] = useState<OpenSeaAsset | null>(null);

  useEffect(() => {
    if (!selectedNFT || !profile) {
      return;
    }

    Analytics.logEvent('view_profile_nft', {
      user_id: profile.user_id ?? '',
      username: profile.username ?? '',
      is_my_profile: isMyProfile,
      token_network: 'ethereum',
      token_contract: selectedNFT.asset_contract.address,
      token_id: selectedNFT.token_id,
    });
  }, [selectedNFT, isMyProfile, profile]);

  return (
    <AssetList>
      {nftAssets.length > 0 ? (
        nftAssets.map((asset, index) => {
          const isVideo =
            !!asset.animation_url ||
            asset.image_url?.toLowerCase()?.endsWith('.mp4') ||
            false;

          return (
            <AssetListItem key={index} onClick={() => setSelectedNFT(asset)}>
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
              <AssetName>{asset.name || `#${asset.token_id}`}</AssetName>
            </AssetListItem>
          );
        })
      ) : (
        <Empty>No NFTs Found</Empty>
      )}

      {selected && (
        <NFTDetailModal
          asset={selectedNFT}
          visible={!!selectedNFT}
          onDismiss={() => setSelectedNFT(null)}
          isMyProfile={isMyProfile}
          onClickSetAsProfile={(assetImage) => {
            if (!profile || !selectedNFT) {
              return;
            }
            Analytics.logEvent('set_nft_as_profile', {
              user_id: profile.user_id ?? '',
              username: profile.username ?? '',
              is_my_profile: isMyProfile,
              token_network: 'ethereum',
              token_contract: selectedNFT.asset_contract.address,
              token_id: selectedNFT.token_id,
            });
            onClickSetAsProfile(assetImage);
          }}
        />
      )}
    </AssetList>
  );
};

// FIXME: Those are similar declares with `TokenDetailModal`
const AssetList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const AssetListItem = styled.li`
  display: flex;
  flex-direction: column;

  width: calc((100% - 24px) / 3);

  @media screen and (max-width: 32rem) {
    width: calc((100% - 12px) / 2);
  }
`;
const AssetName = styled.span`
  margin-top: 4px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  font-size: 14px;
  line-height: 20px;
  color: ${Colors.gray400};
`;
