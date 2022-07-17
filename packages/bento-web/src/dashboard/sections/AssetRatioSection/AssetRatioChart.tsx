import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import styled from 'styled-components';

import { PLATFORM_LOGOS } from '@/dashboard/constants/platform';
import { WalletBalance } from '@/dashboard/types/WalletBalance';

import { TooltipContent, tooltipWrapperStyle } from './AssetRatioChartTooltip';

const CHART_SIZE = 240;
const PIE_WIDTH = CHART_SIZE * 0.1;
const AVAILABLE_COLORS = [
  '#FF214A',
  '#f72585',
  '#FAA945',
  '#d446ff',
  '#7c44ff',
  '#656fff',
  '#4cc9f0',
];

type AssetRatioChartProps = {
  tokenBalances: {
    symbol: string | null;
    name: string;
    logo?: string;
    tokenAddress?: string;
    balances: WalletBalance[];
    netWorth: number;
    amount: number;
    price: number;
    type?: 'nft';
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

    // merge type nft with one
    let items: { label: string; value: number; logo?: string }[] = [];
    const netWorthInNFTs = tokenBalances.reduce(
      (acc, info) => (info.type === 'nft' ? (acc += info.netWorth) : acc),
      0,
    );
    if (netWorthInNFTs > 0) {
      const percentage = (netWorthInNFTs / netWorthInUSD) * 100;
      items.push({
        label: 'OpenSea NFTs',
        value: !percentage || isNaN(percentage) ? 0 : percentage,
        logo: PLATFORM_LOGOS.opensea,
      });
    }

    items = items.concat(
      tokenBalances.flatMap((info, index) => {
        if (info.type === 'nft') {
          return [];
        }

        const { name, netWorth } = info;
        const percentage = (netWorth / netWorthInUSD) * 100;
        if (percentage < 0.01 || index > AVAILABLE_COLORS.length + 2) {
          return [];
        }
        return {
          label: name,
          logo: info.logo,
          value: !percentage || isNaN(percentage) ? 0 : percentage,
        };
      }),
    );

    return items;
  }, [tokenBalances]);

  return (
    <ChartContainer>
      <ResponsiveContainer width={CHART_SIZE} height={CHART_SIZE}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={CHART_SIZE * 0.5 - PIE_WIDTH}
            outerRadius={CHART_SIZE * 0.5}
            cornerRadius={4}
            paddingAngle={4}
            startAngle={90}
            endAngle={90 + 360}
            dataKey="value"
            minAngle={PIE_WIDTH - 2}
          >
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={AVAILABLE_COLORS[index] ?? '#5b739b'}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            content={({ payload }) => {
              const first = payload?.[0]?.payload;
              return (
                <TooltipContent
                  label={first?.label ?? ''}
                  value={first?.value ?? 0}
                  logo={first?.logo}
                />
              );
            }}
            wrapperStyle={tooltipWrapperStyle}
          />
        </PieChart>
      </ResponsiveContainer>

      <AvatarContainer>
        {/* <Avatar src="/assets/avatar.png" /> */}
        <BentoZapImage />
      </AvatarContainer>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: ${CHART_SIZE}px;

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

  pointer-events: none;
`;

const BentoZapImage = styled.img.attrs({
  src: '/assets/illusts/bento-zap.png',
})`
  width: 160px;
  height: 160px;
  user-select: none;
`;
