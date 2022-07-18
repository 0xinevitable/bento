import clsx from 'clsx';
import { useMemo } from 'react';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';

import { PLATFORM_LOGOS } from '../constants/platform';
import { TokenBalance } from '../types/TokenBalance';

type TokenBalanceItemProps = {
  tokenBalance: TokenBalance;
  onClick: () => void;
};

export const TokenBalanceItem: React.FC<TokenBalanceItemProps> = ({
  tokenBalance: info,
  onClick,
}) => {
  const platformURL = useMemo(
    () => PLATFORM_LOGOS[info.platform as keyof typeof PLATFORM_LOGOS],
    [info.platform],
  );

  return (
    <Container
      className={clsx(
        'py-3 p-3 h-fit rounded-md drop-shadow-2xl',
        'flex flex-col cursor-pointer',
      )}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative">
          <img
            className="w-16 h-16 rounded-full object-cover"
            src={info.logo}
            alt={info.name}
          />
          <img
            className="w-6 h-6 absolute bottom-[-8px] left-[-8px] rounded-full ring-2 ring-black/20"
            src={platformURL}
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
  width: calc(33.33% - 8px);

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
  box-shadow: inset 5px 5px 16px #0b0c0e, inset -5px -5px 16px #212426;
  border-radius: 8px;

  @media screen and (max-width: 797px) {
    width: calc(50% - 4px);
  }

  @media screen and (max-width: 537px) {
    width: 100%;
  }

  img {
    user-select: none;
  }
`;

const InlineBadge = styled(Badge)`
  margin-left: 8px;
  padding: 4px;
  padding-bottom: 3px;
  display: inline-flex;
  font-size: 10px;
  backdrop-filter: none;
`;
