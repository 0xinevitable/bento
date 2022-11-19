import styled from '@emotion/styled';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { withAttrs } from '@/utils/withAttrs';

import { NETWORKS } from '@/constants/networks';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';

import { TooltipContent, tooltipWrapperStyle } from './AssetRatioChartTooltip';

const CHART_SIZE = 184;
const PIE_WIDTH = 18;
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
  tokenBalances: DashboardTokenBalance[];
  totalNetWorth: number;
  assetRatioByPlatform: {
    platform: string;
    netWorth: number;
    name: string;
    ratio: number;
  }[];
};

export const AssetRatioChart: React.FC<AssetRatioChartProps> = ({
  tokenBalances,
  totalNetWorth,
  assetRatioByPlatform,
}) => {
  const data = useMemo(() => {
    if (assetRatioByPlatform.length < 1) {
      return [{ label: 'Empty', value: 100 }];
    }

    let items: { label: string; value: number; logo?: string }[] = [];

    items = items.concat(
      assetRatioByPlatform.flatMap((item, index) => {
        const { name, ratio } = item;
        if (ratio < 0.01 || index > AVAILABLE_COLORS.length + 2) {
          return [];
        }

        return {
          label: name,
          logo: NETWORKS.find((v) => v.id === item.platform)?.logo,
          value: !ratio || isNaN(ratio) ? 0 : ratio,
        };
      }),
    );

    return items;
  }, [tokenBalances]);

  return (
    <ChartContainer>
      <div style={{ width: CHART_SIZE, height: CHART_SIZE }}>
        <ResponsiveContainer width="100%" height="100%">
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
              {data.map((data, index) => (
                <Cell
                  key={data.label}
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
      </div>

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

const BentoZapImage = withAttrs(
  { src: '/assets/illusts/bento-zap.png' },
  styled.img`
    width: 115px;
    height: 115px;
    user-select: none;
  `,
);
