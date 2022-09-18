import { Badge } from '@bento/client/components';
import { DashboardTokenBalance } from '@bento/client/dashboard/types/TokenBalance';
import { Colors } from '@bento/client/styles';
import styled from 'styled-components';

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
    <Container
      className="py-3 p-3 h-fit rounded-md flex flex-col cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={info.logo}
            alt={info.name}
          />
          <PlatformBadge
            alt={capitalize(info.platform)}
            src={`/assets/icons/${info.platform}.png`}
          />
        </div>
        <div className="ml-4 min-w-0 flex flex-col flex-1">
          <span className="text-sm text-slate-400/40 flex items-center">
            <span className="truncate text-slate-400">
              {info.type === 'nft' ? info.name : info.symbol}
            </span>
            <InlineBadge>{info.amount.toLocaleString()}</InlineBadge>
          </span>
          <span className="text-xl font-bold text-slate-50/90">
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

  background: ${Colors.gray900};
  border: 1px solid ${Colors.gray800};
  border-radius: 8px;

  @media screen and (max-width: 797px) {
    width: calc((100% - 4px) / 2);
  }

  @media screen and (max-width: 537px) {
    width: 100%;
  }

  img {
    user-select: none;
  }
`;

const PlatformBadge = styled.img`
  position: absolute;
  left: -8px;
  bottom: -8px;

  width: 24px;
  height: 24px;
  border-radius: 50%;
  outline: 2px solid ${Colors.gray900};
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
