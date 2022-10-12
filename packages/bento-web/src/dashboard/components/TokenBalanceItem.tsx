import styled from 'styled-components';

import { Badge } from '@/components/system';

import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { Colors, systemFontStack } from '@/styles';

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

type TokenBalanceItemProps = {
  tokenBalance: DashboardTokenBalance;
  onClick: () => void;
};

export const TokenBalanceItem: React.FC<TokenBalanceItemProps> = ({
  tokenBalance: info,
  onClick,
}) => {
  return (
    <Container onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'relative' }}>
          <Logo src={info.logo} alt={info.name} />
          <PlatformBadge
            alt={capitalize(info.platform)}
            src={`/assets/icons/${info.platform}.png`}
          />
        </div>
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
              lineHeight: 16,
              color: Colors.gray600,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span className="truncate" style={{ color: Colors.gray400 }}>
              {info.type === 'nft' ? info.name : info.symbol}
            </span>
            <InlineBadge>{info.amount.toLocaleString()}</InlineBadge>
          </span>
          <NetWorth>
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

const Logo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
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

  /* FIXME: Tailwind */
  &,
  & * {
    font-family: ${systemFontStack} !important;
  }
`;
const Price = styled.span`
  margin-left: 4px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: ${Colors.gray400};
`;
