import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useState } from 'react';

import { Skeleton } from '@/components/system';

type AssetMediaProps = {
  className?: string;
  src?: string;
  poster?: string;
  isVideo?: boolean;
};

export const AssetMedia: React.FC<AssetMediaProps> = ({
  isVideo = false,
  src,
  poster,
  ...props
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!isVideo || !poster) {
      return;
    }
    const img = new Image();
    img.src = poster;
    img.onload = () => setLoaded(true);
  }, [isVideo, poster]);

  return (
    <>
      {!loaded ? (
        <AssetSkeleton
          style={{ display: loaded ? 'none' : undefined }}
          {...props}
        />
      ) : null}
      {!isVideo ? (
        <AssetImage
          src={src}
          loaded={loaded}
          onLoad={() => setLoaded(true)}
          {...props}
        />
      ) : (
        <AssetVideo
          src={src}
          poster={poster}
          width={98}
          height={98}
          loaded={loaded}
          autoPlay
          muted
          loop
          playsInline
          {...props}
        />
      )}
    </>
  );
};

const assetMediaStyle = css`
  width: 100%;
  aspect-ratio: 1;

  object-fit: cover;
  border-radius: 8px;
`;

const AssetSkeleton = styled(Skeleton)`
  ${assetMediaStyle}
`;

type LoadedProps = {
  loaded: boolean;
};
const AssetImage = styled.img<LoadedProps>`
  ${assetMediaStyle}
  background-color: black;

  ${({ loaded }) =>
    !loaded &&
    css`
      display: none;
    `};
`;
const AssetVideo = styled.video<LoadedProps>`
  ${assetMediaStyle}
  background-color: black;

  ${({ loaded }) =>
    !loaded &&
    css`
      display: none;
    `};
`;
