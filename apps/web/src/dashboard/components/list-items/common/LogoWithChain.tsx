import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { BentoSupportedNetwork } from '@/constants/adapters';
import { Colors } from '@/styles';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

type LogoWithChainProps = {
  logo?: string;
  chain: BentoSupportedNetwork | 'opensea';
  size?: number;
};

export const LogoWithChain: React.FC<LogoWithChainProps> = ({
  logo,
  chain,
  size = 44,
}) => (
  <LogoContainer size={size}>
    <LogoBackground>
      {!!logo ? (
        <Logo alt="" src={logo} size={size} />
      ) : (
        <LogoEmpty size={size} />
      )}
    </LogoBackground>

    <ChainImage
      alt={capitalize(chain)}
      src={`/assets/icons/${chain}.png`}
      size={size}
    />
  </LogoContainer>
);

const GAP = 10;

type SizeProps = {
  size: number;
};
const LogoContainer = styled.div<SizeProps>`
  padding: 1.5px;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;

  background-color: #aaaaaa;
  background-image: radial-gradient(
    96.62% 96.62% at 10.25% 1.96%,
    #aaaaaa 0%,
    #282c30 37.71%,
    #787d83 100%
  );

  ${({ size }) =>
    size &&
    css`
      width: ${size + GAP}px;
      height: ${size + GAP}px;
    `};
`;
const LogoBackground = styled.div`
  background: ${Colors.black};
  width: 100%;
  height: 100%;
  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;
`;
const Logo = styled.img<SizeProps>`
  border-radius: 50%;
  object-fit: cover;

  ${({ size }) =>
    size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `};
`;
const LogoEmpty = styled.div<SizeProps>`
  border-radius: 50%;

  ${({ size }) =>
    size &&
    css`
      width: ${size}px;
      height: ${size}px;
    `};
`;

const ChainImage = styled.img<SizeProps>`
  position: absolute;
  left: -10px;
  bottom: -10px;

  border-radius: 50%;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.44);

  ${({ size }) =>
    size &&
    css`
      width: ${Math.floor(size * 0.54)}px;
      height: ${Math.floor(size * 0.54)}px;
    `};
`;
