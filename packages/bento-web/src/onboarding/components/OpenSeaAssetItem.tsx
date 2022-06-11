import { OpenSeaAsset } from '@bento/client';
import React from 'react';
import styled from 'styled-components';

type OpenSeaAssetItemProps = { asset: OpenSeaAsset };

export const OpenSeaAssetItem: React.FC<OpenSeaAssetItemProps> = ({
  asset,
}) => {
  return (
    <Container key={asset.id}>
      <ImageWrapper src={asset.image_preview_url}>
        <img src={asset.image_preview_url} />
      </ImageWrapper>
      <TokenId className="text-xs text-slate-100/40 font-semibold truncate">
        {`#${asset.token_id}`}
      </TokenId>
      <CollectionName className="text-xs text-slate-400/80 font-semibold truncate">
        {asset.name}
      </CollectionName>
      <Name className="text-xs text-slate-100/80 font-semibold">
        {asset.name ?? `#${asset.token_id}`}
      </Name>
    </Container>
  );
};

const Container = styled.li`
  padding: 2px;
  width: 120px;
  display: flex;
  flex-direction: column;
`;

type ImageWrapperProps = {
  src: string;
};
const ImageWrapper = styled.div<ImageWrapperProps>`
  width: 100%;
  padding-bottom: 100%;

  position: relative;
  aspect-ratio: 1;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  z-index: 0;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    backdrop-filter: blur(8px);
    z-index: 1;
  }

  & > img {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    width: 100%;
    height: 100%;
    object-fit: contain;
    z-index: 2;
  }
`;

const CollectionName = styled.span``;
const Name = styled.span`
  min-height: 32px;

  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TokenId = styled.span`
  font-size: 10px;
`;
