import { css } from '@emotion/react';
import styled from '@emotion/styled';
import dedent from 'dedent';
import React, { useState } from 'react';

import { Skeleton } from '@/components/system';

type ProfileImageType = React.HTMLAttributes<HTMLDivElement> & {
  source?: string;
  children?: React.ReactNode;
};

export const ProfileImage: React.FC<ProfileImageType> = ({
  source,
  children,
  ...props
}) => {
  const [loaded, setLoaded] = useState<boolean>(false);

  return (
    <ImageContainer {...props}>
      {!loaded && <ImageSkeleton />}
      <Image
        src={source}
        onLoad={() => setLoaded(true)}
        style={{ display: !loaded ? 'none' : undefined }}
      />
      <BlurUnderlay src={source} />
      <ImageBorder className="image-border" />
      {children}
    </ImageContainer>
  );
};

const ImageContainer = styled.div`
  width: 128px;
  height: 128px;
  position: relative;
  border-radius: 50%;
  filter: drop-shadow(0px 21px 12px rgba(0, 0, 0, 0.25));

  * {
    user-select: none;
    -webkit-user-drag: none;
  }
`;
const imageStyles = css`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;
const Image = styled.img`
  ${imageStyles}
  background-color: black;
`;
const ImageSkeleton = styled(Skeleton)`
  ${imageStyles}
`;
const BlurUnderlay = styled(Image)`
  position: absolute;
  left: 0;
  right: 0;
  top: 16px;
  bottom: -16px;
  z-index: 1;
  filter: blur(32px);
  opacity: 52%;
  transform: translateZ(0);
`;

const gradientBorderMask = dedent`
  url('data:image/svg+xml;utf8,
    <svg xmlns="http://www.w3.org/2000/svg">
      <rect
        x="2" y="2" width="100%" height="100%"
        style="height:calc(100% - 4px);width:calc(100% - 4px)"
        rx="50%" ry="50%" stroke-width="4px"
        fill="transparent"
        stroke="white"
      />
    </svg>
  ') 0 / 100% 100%;
`;
const ImageBorder = styled.div`
  width: 129px;
  height: 129px;
  position: relative;
  z-index: 8;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: inherit;
    background-size: auto;

    mask: ${gradientBorderMask};
    -webkit-mask: ${gradientBorderMask};
  }

  background-color: #e35252;
  background-image: linear-gradient(
    to right bottom,
    #ff3e3e 0%,
    #ff8f3a 30%,
    #ff214a 65%
  );
`;
