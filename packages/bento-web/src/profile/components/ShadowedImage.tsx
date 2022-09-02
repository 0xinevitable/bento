import React from 'react';
import styled from 'styled-components';

type Props = {
  className?: string;
  src?: string;
  blurStyle?: React.CSSProperties;
};

export const ShadowedImage: React.FC<Props> = ({
  className,
  src,
  blurStyle,
}) => (
  <ImageWrapper className={className}>
    <Image referrerPolicy="no-referrer" className={className} src={src} />
    <ImageBlur
      referrerPolicy="no-referrer"
      className={`blur ${className}`}
      src={src}
      style={blurStyle}
    />
  </ImageWrapper>
);

const ImageWrapper = styled.div`
  position: relative;
  z-index: -1;
`;

const Image = styled.img`
  object-fit: cover;
  position: absolute;
  top: 0;
  z-index: 2;
  border-radius: 8px;
  background-color: #eeeeee;
`;

const ImageBlur = styled(Image)`
  top: auto;
  top: 8px;
  z-index: auto;
  filter: blur(22px);
  opacity: 0.75;
`;
