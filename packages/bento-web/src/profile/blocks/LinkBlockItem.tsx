import React from 'react';
import styled, { css } from 'styled-components';

import { ShadowedImage } from '../components/ShadowedImage';
import { LinkBlock } from './types';

type Props = LinkBlock & {};

export const LinkBlockItem: React.FC<Props> = (props) => {
  const hasImage = !!props.images?.[0];

  return (
    <Wrapper>
      <Link href={props.url} rel="nofollow" target="_blank">
        <Container large={props.large}>
          <span className="ripple" />
          {hasImage &&
            (!props.large ? (
              <LinkImageWrapper>
                <LinkImage src={props.images?.[0]} />
              </LinkImageWrapper>
            ) : (
              <LargeImage src={props.images?.[0]} />
            ))}
          <Information
            className="information"
            style={!hasImage ? { alignItems: 'center' } : {}}
          >
            <Title>{props.title}</Title>

            {!!props.description && (
              <Description>{props.description}</Description>
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
  background-color: #262b34;
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

  @keyframes shake {
    25% {
      transform: rotate(calc(var(--angle) * -1));
    }

    50% {
      transform: rotate(var(--angle));
    }

    100% {
      transform: rotate(0deg);
    }
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
    background: #d9d4cb;
    transform: translate(-50%, -50%);
    transition: width var(--time), padding-top var(--time);
  }

  &:hover span.ripple {
    width: 200%;
    padding-top: calc(var(--width) * 2.25);
  }

  &:hover .information {
    color: black;
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

const Information = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 3;

  color: white;
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

  ${secondLineClamp}
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);

  ${secondLineClamp}
`;
