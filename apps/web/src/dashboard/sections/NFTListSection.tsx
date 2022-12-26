import { BentoUser } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import styled from '@emotion/styled';
import { useEffect } from 'react';

import { AssetMedia } from '@/components/system';

import { UserProfile } from '@/profile/types/UserProfile';
import { Colors } from '@/styles';
import { Analytics } from '@/utils';

import { EmptyBalance } from '../components/EmptyBalance';
import { KlaytnNFTAsset } from '../hooks/useKlaytnNFTs';

type Props = {
  nftAssets: (OpenSeaAsset | KlaytnNFTAsset)[];
  user: BentoUser;
  isMyProfile: boolean;

  selectedNFT: OpenSeaAsset | KlaytnNFTAsset | null;
  setSelectedNFT: (asset: OpenSeaAsset | KlaytnNFTAsset | null) => void;
};

export const NFTListSection: React.FC<Props> = ({
  nftAssets,
  user,
  isMyProfile,
  selectedNFT,
  setSelectedNFT,
}) => {
  useEffect(() => {
    if (!selectedNFT || !user) {
      return;
    }

    Analytics.logEvent('view_profile_nft', {
      user_id: user.id ?? '',
      username: user.username ?? '',
      is_my_profile: isMyProfile,
      token_network: 'ethereum',
      token_contract: selectedNFT.asset_contract.address,
      token_id: selectedNFT.token_id,
      medium: 'dashboard_main',
    });
  }, [selectedNFT, isMyProfile, user]);

  return (
    <AssetList>
      {nftAssets.length > 0 ? (
        nftAssets.map((asset, index) => {
          const isVideo =
            asset.image_url?.toLowerCase()?.endsWith('.mp4') || false;
          return (
            <AssetListItem key={index} onClick={() => setSelectedNFT(asset)}>
              <AssetMedia
                src={
                  (!isVideo
                    ? asset.image_url || asset.collection.image_url
                    : asset.image_url) || undefined
                }
                poster={
                  asset.image_url ||
                  asset.image_preview_url ||
                  asset.collection.image_url ||
                  undefined
                }
                isVideo={isVideo}
              />
              <AssetName>{asset.name || `#${asset.token_id}`}</AssetName>
            </AssetListItem>
          );
        })
      ) : (
        // TODO: Change this for NFTs
        <EmptyBalance />
      )}
    </AssetList>
  );
};

// FIXME: Those are similar declares with `DetailModal`
const AssetList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const getWidth = (count: number) =>
  `calc((100% - ${12 * (count - 1)}px) / ${count})`;
const AssetListItem = styled.li`
  display: flex;
  flex-direction: column;

  width: ${getWidth(5)};

  @media (max-width: 1100px) {
    width: ${getWidth(4)};
  }

  @media (max-width: 600px) {
    width: ${getWidth(3)};
  }

  @media (max-width: 420px) {
    width: ${getWidth(2)};
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
