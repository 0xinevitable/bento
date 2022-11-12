import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { BentoSupportedNetwork } from '@/constants/adapters';
import { Colors } from '@/styles';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

type LogoWithChainProps = {
  logo?: string;
  chain: BentoSupportedNetwork | 'opensea';
};

export const LogoWithChain: React.FC<LogoWithChainProps> = ({
  logo,
  chain,
}) => (
  <LogoContainer>
    <LogoBackground>
      {!!logo ? <Logo alt="" src={logo} /> : <LogoEmpty />}
    </LogoBackground>

    <ChainImage alt={capitalize(chain)} src={`/assets/icons/${chain}.png`} />
  </LogoContainer>
);

const LOGO_SIZE = 44;
const GAP = 10;

const LogoContainer = styled.div`
  padding: 1px;
  width: ${LOGO_SIZE + GAP}px;
  height: ${LOGO_SIZE + GAP}px;
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
const logoStyles = css`
  width: ${LOGO_SIZE}px;
  height: ${LOGO_SIZE}px;
  border-radius: 50%;
`;
const Logo = styled.img`
  ${logoStyles}
  object-fit: cover;
`;
const LogoEmpty = styled.div`
  ${logoStyles}
`;

const ChainImage = styled.img`
  position: absolute;
  left: -10px;
  bottom: -10px;

  width: 24px;
  height: 24px;
  border-radius: 50%;
  box-shadow: 0px -4px 8px rgba(0, 0, 0, 0.44);
`;
