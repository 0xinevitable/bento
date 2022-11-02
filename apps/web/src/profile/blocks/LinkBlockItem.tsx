import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';

import { shimmer } from '@/components/system/Skeleton';

import { LinkBlock } from '@/profile/blocks';
import { Colors } from '@/styles';

import { ShadowedImage } from '../components/ShadowedImage';

type Props = LinkBlock & {};

export const LinkBlockItem: React.FC<Props> = (props) => {
  const image = props.images?.[0];
  const hasImage = !!image;

  const [imageLoading, setImageLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!image) {
      return;
    }
    const img = new Image();
    img.src = image;
    img.referrerPolicy = 'no-referrer';
    img.onload = () => setImageLoading(false);
  }, [image]);

  return (
    <Wrapper>
      <Link href={props.url} rel="nofollow" target="_blank">
        <Container large={props.large}>
          <span className="ripple" />
          {hasImage &&
            (!props.large ? (
              <LinkImageWrapper>
                {imageLoading ? (
                  <LinkImageSkeleton />
                ) : (
                  <LinkImage src={image} />
                )}
              </LinkImageWrapper>
            ) : imageLoading ? (
              <LargeLinkImageSkeleton />
            ) : (
              <LargeImage referrerPolicy="no-referrer" src={image} />
            ))}
          <Information
            className="information"
            style={!hasImage ? { alignItems: 'center' } : {}}
          >
            <Title className="title">{props.title}</Title>

            {!!props.description && (
              <Description className="description">
                {props.description}
              </Description>
            )}
          </Information>
        </Container>
      </Link>
    </Wrapper>
  );
};

const Wrapper = styled.li`
  margin-top: 8px;
  cursor: pointer;
`;
const Link = styled.a``;

type ContainerProps = {
  large?: boolean;
};
const Container = styled.div<ContainerProps>`
  min-height: ${56 + 24}px;
  padding: 12px;

  border-radius: 8px;
  background-color: ${Colors.gray800};
  display: flex;

  --width: 100%;
  --time: 0.7s;

  position: relative;
  color: white;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.04);
  }

  span.ripple {
    position: absolute;
    left: 221px;
    top: 43px;

    display: block;
    content: '';
    z-index: 2;
    width: 0;
    height: 0;

    border-radius: 100%;
    background-color: ${Colors.gray600};
    transform: translate(-50%, -50%);
    transition: width var(--time), padding-top var(--time);
  }

  &:hover span.ripple {
    width: 200%;
    padding-top: calc(var(--width) * 2.25);
  }

  .title,
  .description {
    transition: all var(--time) ease;
  }

  &:hover .information {
    .title {
      color: ${Colors.white};
    }

    .description {
      color: ${Colors.gray200};
    }
  }

  ${({ large }) =>
    large &&
    css`
      flex-direction: column;
      margin-bottom: 16px;

      .information {
        width: 100%;
        padding: 16px 0 4px;
        align-items: center;
      }

      &:hover span.ripple {
        width: 200%;
        padding-top: calc(var(--width) * 4.5);
      }
    `};
`;

const LinkImageWrapper = styled.div`
  z-index: 9;
  margin-right: 16px;
`;

const LinkImage = styled(ShadowedImage)`
  width: 86px;
  height: 86px;
`;

const LargeImage = styled.img`
  width: 100%;
  border-radius: 8px;
  z-index: 2;
`;

const customSkeletonStyle = css`
  border-radius: 8px;

  position: relative;
  background-color: #171717;
  background-image: linear-gradient(to right, #171717, #3b3b3b, #171717);
  background-repeat: no-repeat;
  background-size: 500% 100%;
  animation: 1s ease-in-out infinite forwards running ${shimmer};
`;
const LinkImageSkeleton = styled.div`
  width: 86px;
  height: 86px;

  ${customSkeletonStyle}
`;
const LargeLinkImageSkeleton = styled.div`
  width: 100%;
  z-index: 2;

  ${customSkeletonStyle}
`;

const Information = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 3;
  transition: color 0.2s ease-in-out;
`;

const secondLineClamp = css`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 600;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  word-break: keep-all;
  color: ${Colors.gray050};

  ${secondLineClamp}
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};

  ${secondLineClamp}
`;
