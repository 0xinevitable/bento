import styled from 'styled-components';

import { Badge } from '@/components/system';

import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { Colors } from '@/styles';

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
      <div className="flex items-center">
        <div className="relative">
          <Logo src={info.logo} alt={info.name} />
          <PlatformBadge
            alt={capitalize(info.platform)}
            src={`/assets/icons/${info.platform}.png`}
          />
        </div>
        <div className="ml-2 min-w-0 flex flex-col flex-1">
          <span className="text-xs text-slate-400/40 flex items-center">
            <span className="truncate text-slate-400">
              {info.type === 'nft' ? info.name : info.symbol}
            </span>
            <InlineBadge>{info.amount.toLocaleString()}</InlineBadge>
          </span>
          <span className="text-lg font-bold text-slate-50/90">
            {`$${info.netWorth.toLocaleString()}`}

            {info.amount !== 1 && (
              <span className="ml-1 text-sm font-medium text-slate-400/40">
                {`$${info.price.toLocaleString()}`}
              </span>
            )}
          </span>
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

  @media screen and (max-width: 797px) {
    width: calc((100% - 4px) / 2);
  }

  @media screen and (max-width: 537px) {
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
