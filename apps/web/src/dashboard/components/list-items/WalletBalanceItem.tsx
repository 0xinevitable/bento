import styled from '@emotion/styled';
import { Icon } from '@iconify/react';

import { BentoSupportedNetwork } from '@/constants/adapters';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { Colors } from '@/styles';

import { Badge } from './common/Badge';
import { Container } from './common/Container';
import { LogoWithChain } from './common/LogoWithChain';

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
          <Badge>
            <Icon icon="mingcute:wallet-4-line" />
            {info.amount.toLocaleString()}
          </Badge>
        </span>
        <NetWorth className="sys">
          {`$${info.netWorth.toLocaleString()}`}

          {info.amount !== 1 && (
            <Price>{`$${info.price.toLocaleString()}`}</Price>
          )}
        </NetWorth>
      </div>
    </Container>
  );
};

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
