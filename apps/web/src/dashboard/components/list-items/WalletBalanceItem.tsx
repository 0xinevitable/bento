import { css } from '@emotion/react';
import styled from '@emotion/styled';

import { Badge } from '@/components/system';

import { BentoSupportedNetwork } from '@/constants/adapters';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { Colors } from '@/styles';

import { LogoWithChain } from '../common/LogoWithChain';

type WalletBalanceItemProps = {
  tokenBalance: DashboardTokenBalance;
  onClick: () => void;
};

export const WalletBalanceItem: React.FC<WalletBalanceItemProps> = ({
  tokenBalance: info,
  onClick,
}) => {
  return (
    <Container onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LogoWithChain
          logo={info.logo}
          chain={info.platform as BentoSupportedNetwork | 'opensea'}
        />

        <div
          style={{
            marginLeft: 8,
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
          }}
        >
          <span
            style={{
              fontSize: 12,
              lineHeight: '16px',
              color: Colors.gray600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span
              className="sys truncate"
              style={{ color: Colors.gray400, fontWeight: 500 }}
            >
              {info.type === 'nft' ? info.name : info.symbol}
            </span>
            <span className="sys">
              <InlineBadge>{info.amount.toLocaleString()}</InlineBadge>
            </span>
          </span>
          <NetWorth className="sys">
            {`$${info.netWorth.toLocaleString()}`}

            {info.amount !== 1 && (
              <Price>{`$${info.price.toLocaleString()}`}</Price>
            )}
          </NetWorth>
        </div>
      </div>
    </Container>
  );
};

const Container = styled.li`
  width: calc((100% - 8px) / 3);
  height: fit-content;
  padding: 10px;

  background: ${Colors.gray900};
  border: 1px solid ${Colors.gray800};
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  cursor: pointer;

  @media (max-width: 1100px) {
    width: calc((100% - 4px) / 2);
  }

  @media (max-width: 880px) {
    width: calc((100% - 8px) / 3);
  }

  @media (max-width: 720px) {
    width: calc((100% - 8px) / 2);
  }

  @media (max-width: 540px) {
    width: 100%;
  }

  img {
    user-select: none;
  }

  transition: background 0.2s ease-in-out, border 0.2s ease-in-out;

  &:hover {
    background: ${Colors.gray800};
    border: 1px solid ${Colors.gray700};
  }
`;

const logoStyles = css`
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;
const Logo = styled.img`
  ${logoStyles}
  object-fit: cover;
`;
const LogoEmpty = styled.div`
  ${logoStyles}
  background: ${Colors.gray500};
`;

const PlatformBadge = styled.img`
  position: absolute;
  left: -10px;
  bottom: -10px;

  width: 20px;
  height: 20px;
  border-radius: 50%;
  outline: 1px solid ${Colors.gray900};
`;

const InlineBadge = styled(Badge)`
  && {
    margin-left: 8px;
    padding: 4px;
    padding-bottom: 3px;
    display: inline-flex;
    font-size: 10px;
    backdrop-filter: none;
  }
`;

const NetWorth = styled.span`
  font-size: 18px;
  line-height: 28px;
  font-weight: bold;
  color: ${Colors.gray050};
`;
const Price = styled.span`
  margin-left: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${Colors.gray400};
`;
