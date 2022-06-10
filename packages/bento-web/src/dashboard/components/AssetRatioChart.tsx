import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import styled, { css } from 'styled-components';

import { WalletBalance as CosmosSDKWalletBalance } from '@/pages/api/cosmos-sdk/[network]/[walletAddress]';
import { WalletBalance } from '@/pages/api/evm/[network]/[walletAddress]';

const PIE_WIDTH = 12;

type AssetRatioChartProps = {
  tokenBalances: {
    symbol: string;
    name: string;
    logo: string;
    tokenAddress: string;
    balances: (WalletBalance | CosmosSDKWalletBalance)[];
    netWorth: number;
    amount: number;
    price: number;
  }[];
  netWorthInUSD: number;
};

export const AssetRatioChart: React.FC<AssetRatioChartProps> = ({
  tokenBalances,
  netWorthInUSD,
}) => {
  const data = useMemo(() => {
    if (tokenBalances.length < 1) {
      return [{ label: 'Empty', value: 100 }];
    }
    return tokenBalances.map((info) => {
      const { symbol, name, netWorth } = info;
      const percentage = (netWorth / netWorthInUSD) * 100;
      return {
        label: `${symbol} ${name}`,
        value: !percentage || isNaN(percentage) ? 0 : percentage,
      };
    });
  }, [tokenBalances]);

  return (
    <ChartContainer>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={100 - PIE_WIDTH}
            outerRadius={100}
            cornerRadius={PIE_WIDTH}
            paddingAngle={4}
            startAngle={90}
            endAngle={90 + 360}
            dataKey="value"
            minAngle={PIE_WIDTH - 2}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={
                  [
                    '#FF214A',
                    '#f72585',
                    '#FAA945',
                    '#d446ff',
                    '#7c44ff',
                    '#656fff',
                    '#4cc9f0',
                  ][index] ?? '#5b739b'
                }
                stroke="transparent"
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <AvatarContainer>
        <Avatar src="/assets/avatar.png" />
      </AvatarContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;

  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
`;
const AvatarContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;
type AvatarProps = {
  src: string;
  enlarge?: boolean;
};
const Avatar = styled.div<AvatarProps>`
  width: 154px;
  height: 154px;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  ${({ src }) =>
    src &&
    css`
      background-image: url(${src});
      background-size: 100%;
      background-position: center;
    `};

  &:hover {
    background-size: 110%;
  }
`;
