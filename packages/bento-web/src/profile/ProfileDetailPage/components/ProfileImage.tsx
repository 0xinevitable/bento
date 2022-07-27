import dedent from 'dedent';
import React from 'react';
import styled from 'styled-components';

type ProfileImageType = React.HTMLAttributes<HTMLDivElement> & {
  source: string;
  children?: React.ReactNode;
};

export const ProfileImage: React.FC<ProfileImageType> = ({
  source,
  children,
  ...props
}) => {
  return (
    <ImageContainer {...props}>
      <Image src={source} />
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
`;
const Image = styled.img`
  width: 128px;
  height: 128px;
  filter: drop-shadow(0px 21px 12px rgba(0, 0, 0, 0.25));
  border-radius: 90px;
  z-index: 2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: black;
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
  width: 128px;
  height: 128px;
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
