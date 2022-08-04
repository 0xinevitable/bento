import dedent from 'dedent';
import styled from 'styled-components';

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
};

export const StatueQuoSection: React.FC = () => {
  return (
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
        </IllustContainer>
      </IllustWrapper>
    </Section>
  );
};

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
  right: ${-110 - 38.08}px;
`;
const IllustContainer = styled.div`
  position: relative;
  width: 804.92px;
  height: 513px;
  z-index: 0;
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
