import dedent from 'dedent';
import styled, { css } from 'styled-components';

import { Badge } from '@/components/Badge';

const ASSETS = {
  KING: [
    '/assets/landing/status-quo-king.png',
    '/assets/landing/status-quo-king@2x.png',
  ],
  WALLET: [
    '/assets/landing/status-quo-wallet.png',
    '/assets/landing/status-quo-wallet@2x.png',
  ],
  NOISES: [
    { src: '/assets/landing/noise-1.svg', top: 169.57, left: 43.52 },
    { src: '/assets/landing/noise-2.svg', top: 138.01, left: 251.19 },
    { src: '/assets/landing/noise-3.svg', top: 259.44, left: 288.64 },
    { src: '/assets/landing/noise-4.svg', top: 417.18, left: 246.65 },
    { src: '/assets/landing/noise-5.svg', top: 366.11, left: 179.69 },
    { src: '/assets/landing/noise-6.svg', top: 261.71, left: 57.13 },
  ],
  WALLETS: [
    { value: 'cosmos15zy...gxh0', top: 89.21, left: 242.11 },
    { value: '0x7777...10c4', top: 206.1, left: 53.73 },
    { value: '0x7777...10c4', top: 265, left: 654 },
    { value: 'H6RMXJBoZ9...2SLXd', top: 315.04, left: 80.97 },
    { value: '0x4a00...1001', top: 394.06, left: 284.04 },
  ],
} as const;

export const StatusQuoSection: React.FC = () => {
  return (
    <Wrapper>
      <Section>
        <Information>
          <Badge>The Status Quo</Badge>
          <Title>
            Users are <br />
            NOT Wallets
          </Title>
          <Paragraph>
            Exactly. Users are entirely different from wallets, <br />
            a more extensive concept by itself. <br />
            But current web3 products treat them the same. <br />
            In the cross-chain universe, user activities and assets no longer
            remain in one address or chain.
          </Paragraph>
        </Information>

        <IllustWrapper>
          <IllustContainer>
            <ChessKingIllustContainer>
              <ChessKingIllust
                src={ASSETS.KING[0]}
                srcSet={dedent`
                ${ASSETS.KING[0]} 1x,
                ${ASSETS.KING[1]} 2x
              `}
              />
            </ChessKingIllustContainer>
            <InequalSymbol src="/assets/landing/inequal.svg" />
            <WalletIllustContainer>
              <WalletIllust
                src={ASSETS.WALLET[0]}
                srcSet={dedent`
                ${ASSETS.WALLET[0]} 1x,
                ${ASSETS.WALLET[1]} 2x
              `}
              />
            </WalletIllustContainer>

            {ASSETS.NOISES.map(({ src, top, left }) => (
              <Noise key={src} src={src} top={top} left={left} />
            ))}
            {ASSETS.WALLETS.map(({ value, top, left }) => (
              <Wallet key={value} top={top} left={left}>
                {value}
              </Wallet>
            ))}
          </IllustContainer>
        </IllustWrapper>
      </Section>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  padding: 0 32px;
`;
const Section = styled.section`
  margin: 170px auto 0;
  max-width: 1180px;
  width: 100%;
  position: relative;
`;

const Information = styled.div`
  display: flex;
  flex-direction: column;
`;
const Title = styled.h2`
  margin-top: 27px;

  font-weight: 900;
  font-size: 52px;
  line-height: 103%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;
const Paragraph = styled.p`
  margin-top: 24px;
  max-width: 469px;
  width: 100%;

  font-weight: 400;
  font-size: 16px;
  line-height: 145%;
  letter-spacing: 0.01em;
  color: #ffffff;
`;

const IllustWrapper = styled.div`
  position: absolute;
  top: -79px;
  right: ${-110 + 38.08}px;
`;
const IllustContainer = styled.div`
  position: relative;
  width: 804.92px;
  height: 513px;
  z-index: 0;

  filter: saturate(1.2);
`;

const CHESS_KING_BLUR_TOP = 140 - 52.9;
const CHESS_KING_BLUR_LEFT = 140 - 20.82;
const CHESS_KING_BLUR_RIGHT = 140 - 19.41;
const CHESS_KING_BLUR_BOTTOM = 140 + 11.76;
const ChessKingIllustContainer = styled.div`
  width: 443.09px;
  height: 455.76px;

  position: absolute;
  top: 0;
  left: 0;
`;
const ChessKingIllust = styled.img`
  width: ${443.09 + CHESS_KING_BLUR_TOP + CHESS_KING_BLUR_BOTTOM}px;
  height: ${455.76 + CHESS_KING_BLUR_LEFT + CHESS_KING_BLUR_RIGHT}px;

  margin-top: ${-CHESS_KING_BLUR_TOP}px;
  margin-left: ${-CHESS_KING_BLUR_LEFT}px;
  margin-right: ${-CHESS_KING_BLUR_RIGHT}px;
  margin-bottom: ${-CHESS_KING_BLUR_BOTTOM}px;
`;

const WALLET_ILLUST_BLUR_TOP = 140 - 98.51;
const WALLET_ILLUST_BLUR_RIGHT = 140 - 30.28;
const WalletIllustContainer = styled.div`
  width: 355.5px;
  height: 345px;

  position: absolute;
  top: 168px;
  right: 0;
  z-index: 1;
`;
const WalletIllust = styled.img`
  width: ${355.5 + WALLET_ILLUST_BLUR_RIGHT}px;
  height: ${345 + WALLET_ILLUST_BLUR_TOP}px;

  margin-top: ${-WALLET_ILLUST_BLUR_TOP}px;
  margin-right: ${-WALLET_ILLUST_BLUR_RIGHT}px;
  z-index: 0;
`;

const InequalSymbol = styled.img`
  width: 141px;
  height: 152.29px;

  position: absolute;
  top: 181px;
  left: 358px;
  z-index: -1;
`;

type PositionProps = {
  top: number;
  left: number;
};
const Noise = styled.img<PositionProps>`
  ${({ top, left }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
  `}
`;
const Wallet = styled.span<PositionProps>`
  padding: 6.8px 9px;
  background-color: rgba(51, 9, 17, 0.75);
  border: 1px solid #ff214a;
  box-shadow: 0px 4.5px 9px rgba(0, 0, 0, 0.44);
  border-radius: 9px;

  font-weight: 700;
  font-size: 18px;
  line-height: 103%;
  text-align: center;
  color: #ff214a;

  z-index: 2;

  ${({ top, left }) => css`
    position: absolute;
    top: ${top}px;
    left: ${left}px;
  `}
`;
