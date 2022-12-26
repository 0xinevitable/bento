import { OpenSeaAsset } from '@bento/core';
import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import React, { useMemo } from 'react';

import { AnimatedToolTip, AssetMedia, Modal } from '@/components/system';

import { KlaytnNFTAsset } from '@/dashboard/hooks/useKlaytnNFTs';
import { Colors } from '@/styles';

export type NFTDetailModalParams = {
  asset: OpenSeaAsset | KlaytnNFTAsset | null;
  isMyProfile: boolean;
  onClickSetAsProfile?: (assetImage: string) => void;
};
type Props = NFTDetailModalParams & {
  visible?: boolean;
  onDismiss?: () => void;
};

type ExternalLinkType = 'opensea' | 'looksrare' | 'x2y2' | 'etherscan' | 'blur';
const displayNames: Record<ExternalLinkType, string> = {
  opensea: 'OpenSea',
  looksrare: 'LooksRare',
  x2y2: 'X2Y2',
  etherscan: 'Etherscan',
  blur: 'Blur',
};
const getNFTExternalLinks = (
  network: 'ethereum' | 'klaytn',
  contract: string,
  tokenID: string,
) =>
  network === 'ethereum'
    ? {
        opensea: `https://opensea.io/assets/ethereum/${contract}/${tokenID}`,
        looksrare: `https://looksrare.org/collections/${contract}/${tokenID}`,
        x2y2: `https://x2y2.io/eth/${contract}/${tokenID}`,
        blur: `https://blur.io/collection/${contract}`,
        etherscan: `https://etherscan.io/nft/${contract}/${tokenID}`,
      }
    : {
        opensea: `https://opensea.io/assets/klaytn/${contract}/${tokenID}`,
      };

export const NFTDetailModal: React.FC<Props> = ({
  visible: isVisible = false,
  onDismiss,
  asset,
  isMyProfile,
  onClickSetAsProfile,
}) => {
  const { t } = useTranslation('dashboard');
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

  const externalLinks = useMemo(
    () =>
      !asset || !asset.asset_contract
        ? []
        : (Object.entries(
            getNFTExternalLinks(
              'network' in asset && asset.network === 'klaytn'
                ? 'klaytn'
                : 'ethereum',
              asset.asset_contract.address,
              asset.token_id,
            ),
          ) as [ExternalLinkType, string][]),
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
                src={
                  (!isVideo
                    ? imageURL
                    : !asset.animation_url
                    ? asset.image_url
                    : asset.animation_url) || undefined
                }
                poster={imageURL || undefined}
                isVideo={isVideo}
              />
            </AssetListItem>

            <TokenHeader>
              <TokenName>{asset.name || `#${asset.token_id}`}</TokenName>

              <CollectionRow>
                {!!asset.collection.image_url && (
                  <CollectionImage src={asset.collection.image_url} />
                )}
                <CollectionName>{asset.collection.name}</CollectionName>
              </CollectionRow>

              <ExternalLinkList>
                {externalLinks.map(([linkType, href]) => (
                  <ExternalLink key={linkType} href={href} target="_blank">
                    <ExternalLinkLogo
                      alt=""
                      src={`/assets/icons/${linkType}.png`}
                      width={48}
                      height={48}
                    />
                    <span>{displayNames[linkType]}</span>
                  </ExternalLink>
                ))}
              </ExternalLinkList>
            </TokenHeader>

            {!!imageURL && isMyProfile && !!onClickSetAsProfile && (
              <AnimatedToolTip label={t('Set as profile')}>
                <SetProfileImageButton
                  onClick={() => {
                    onClickSetAsProfile(imageURL);
                    onDismiss?.();
                  }}
                >
                  <MdiImageIcon />
                </SetProfileImageButton>
              </AnimatedToolTip>
            )}
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

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const AssetListItem = styled.div`
  width: 45%;

  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    width: 100%;
  }
`;

const TokenHeader = styled.div`
  margin-left: 16px;
  padding-left: 16px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);

  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 500px) {
    margin-left: 0;
    padding-left: 0;
    border-left: none;

    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }
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

  @media (max-width: 500px) {
    margin-top: 0;
  }
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

const SetProfileImageButton = styled.button`
  width: 42px;
  height: 42px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: radial-gradient(
    89.06% 89.06% at 50% 10.94%,
    #302f32 0%,
    #000000 100%
  );
  border: 1px solid #797979;
  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.3);

  position: absolute;
  left: -8px;
  bottom: -8px;

  cursor: pointer;
`;
// const AntPushPinIcon: React.FC = () => (
//   <svg
//     width="25"
//     height="25"
//     viewBox="0 0 25 25"
//     fill="none"
//     xmlns="http://www.w3.org/2000/svg"
//     style={{ marginTop: -2, marginRight: -2 }}
//   >
//     <path
//       d="M20.6783 9.68301L14.9033 3.90801C14.7509 3.75566 14.5517 3.68066 14.3525 3.68066C14.1533 3.68066 13.9541 3.75566 13.8017 3.90801L10.0259 7.68613C9.74 7.65332 9.45172 7.63926 9.16344 7.63926C7.44781 7.63926 5.73219 8.2041 4.32359 9.33379C3.96266 9.62207 3.93453 10.1635 4.26031 10.4916L8.51891 14.7502L3.47047 19.7939C3.40861 19.8554 3.37043 19.9368 3.36266 20.0236L3.28297 20.8955C3.26188 21.1158 3.43766 21.3033 3.65563 21.3033C3.66734 21.3033 3.67906 21.3033 3.69078 21.301L4.56266 21.2213C4.64938 21.2143 4.73141 21.1744 4.79234 21.1135L9.84078 16.065L14.0994 20.3236C14.2517 20.476 14.4509 20.551 14.6502 20.551C14.8775 20.551 15.1025 20.4525 15.2572 20.2604C16.5767 18.6127 17.1252 16.5502 16.9025 14.5557L20.6783 10.7799C20.9806 10.4799 20.9806 9.9877 20.6783 9.68301V9.68301Z"
//       fill="white"
//       fillOpacity="0.66"
//     />
//   </svg>
// );
const MdiImageIcon: React.FC = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1089_552)">
      <path
        d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
        fill="white"
        fillOpacity="0.66"
      />
    </g>
    <defs>
      <clipPath id="clip0_1089_552">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const ExternalLinkList = styled.div`
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;
const ExternalLink = styled.a`
  padding: 2px 8px;
  width: fit-content;

  background: ${Colors.gray700};
  border-radius: 16px;

  display: flex;
  align-items: center;
  gap: 4px;

  &,
  span {
    transition: all 0.2s ease-in-out;
  }

  span {
    font-size: 13px;
    font-weight: 500;
    color: ${Colors.gray200};
  }

  &:hover {
    background: ${Colors.gray600};

    span {
      color: ${Colors.gray100};
    }
  }

  &:focus {
    opacity: 0.65;
  }
`;
const ExternalLinkLogo = styled(Image)`
  width: 16px;
  height: 16px;
  object-fit: contain;
  border-radius: 50%;
`;
