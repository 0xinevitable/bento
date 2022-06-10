import { useMemo } from 'react';
import styled from 'styled-components';

import { AnimatedTooltip } from '@/components/AnimatedToolTip';
import { WalletBalance as CosmosSDKWalletBalance } from '@/pages/api/cosmos-sdk/[network]/[walletAddress]';
import { WalletBalance } from '@/pages/api/evm/[network]/[walletAddress]';

const tierStyles = ['bg-[#89aacc]', 'bg-[#c74b62]', 'bg-red-900'];

// const netWorthAssetRatios = [
//   { percentage: 20 },
//   { percentage: 76 },
//   { percentage: 4 },
// ];

type TokenBalanceRatioBarProps = {
  balances: (WalletBalance | CosmosSDKWalletBalance)[];
};

export const TokenBalanceRatioBar: React.FC<TokenBalanceRatioBarProps> = ({
  balances,
}) => {
  const assetRatios = useMemo(() => {
    const wallet = balances.reduce((acc, balance) => acc + balance.balance, 0);
    const staked = balances.reduce(
      (acc, balance) =>
        acc + ('delegations' in balance ? balance.delegations : 0),
      0,
    );

    const total = wallet + staked;

    return [
      { label: 'Wallet', percentage: (wallet / total) * 100 },
      { label: 'Staking', percentage: (staked / total) * 100 },
    ];
  }, []);

  return (
    <ProgressBarContainer className="mt-2">
      {assetRatios.map(({ label, percentage }, index) => {
        const className = tierStyles[index];

        return (
          <AnimatedTooltip key={index} label={`${label} ${percentage}%`}>
            <Bar className={className} style={{ maxWidth: `${percentage}%` }} />
          </AnimatedTooltip>
        );
      })}
    </ProgressBarContainer>
  );
};

const ProgressBarContainer = styled.ul`
  width: 100%;
  height: 5px;
  display: flex;
`;
const Bar = styled.li`
  min-width: 8px;
  border-radius: 3px;
  position: relative;

  flex: 1;
  display: flex;
  transition: all 0.2s ease-in-out;

  &:not(:last-of-type) {
    margin-right: 3px;
  }
`;
