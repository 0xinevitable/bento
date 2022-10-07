import { OpenSeaAsset } from '@bento/core';
import axios, { AxiosError } from 'axios';
import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AssetMedia } from '@/components/system';

import { NFTDetailModal } from '@/profile/instance/sections/NFTDetailModal';
import { UserProfile } from '@/profile/types/UserProfile';
import { Colors } from '@/styles';
import { Analytics, toast } from '@/utils';

import { EmptyBalance } from '../components/EmptyBalance';

// FIXME: Duplicated type declaration
type ErrorResponse =
  | {
      code: 'USERNAME_UNUSABLE' | 'VALUE_REQUIRED' | string;
      message: string;
    }
  | undefined;

type Props = {
  selected: boolean;
  nftAssets: OpenSeaAsset[];
  profile: UserProfile | null;
  revalidateProfile: () => void;
  isMyProfile: boolean;
};

export const NFTListSection: React.FC<Props> = ({
  nftAssets,
  selected,
  profile,
  revalidateProfile,
  isMyProfile,
}) => {
  const { t } = useTranslation('dashboard');
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
      medium: 'dashboard_main',
    });
  }, [selectedNFT, isMyProfile, profile]);

  const onClickSetAsProfile = useCallback(
    async (assetImage: string) => {
      try {
        await axios.post(`/api/profile`, {
          username: profile?.username.toLowerCase(),
          display_name: profile?.display_name,
          images: [assetImage],
        });
        revalidateProfile?.();

        setTimeout(() => {
          toast({
            type: 'success',
            title: 'Changes Saved',
          });

          document.body.scrollIntoView({
            behavior: 'smooth',
          });
        });
      } catch (e) {
        if (e instanceof AxiosError) {
          const errorResponse = e.response?.data as ErrorResponse;
          if (errorResponse?.code === 'USERNAME_UNUSABLE') {
            toast({
              type: 'error',
              title: errorResponse.message,
              description: 'Please choose another username',
            });
          } else if (errorResponse?.code === 'VALUE_REQUIRED') {
            toast({
              type: 'error',
              title: errorResponse.message,
            });
          } else {
            toast({
              type: 'error',
              title: 'Server Error',
              description: errorResponse?.message || 'Something went wrong',
            });
          }
        }
      }
    },
    [profile, revalidateProfile],
  );

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
        // TODO: Change this for NFTs
        <EmptyBalance />
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
              medium: 'dashboard_main',
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
