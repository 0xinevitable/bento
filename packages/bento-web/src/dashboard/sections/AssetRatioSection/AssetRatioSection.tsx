import groupBy from 'lodash.groupby';
import { useMemo } from 'react';
import styled from 'styled-components';

import { displayName } from '@/dashboard/constants/platform';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';

import { AssetRatioChart } from './AssetRatioChart';
import { AssetRatioListItem } from './AssetRatioListItem';

type AssetRatioSectionProps = {
  netWorthInUSD: number;
  tokenBalances: DashboardTokenBalance[];
};
export const AssetRatioSection: React.FC<AssetRatioSectionProps> = ({
  tokenBalances,
  netWorthInUSD,
}) => {
  const assetRatioByPlatform = useMemo(() => {
    const groups = groupBy(tokenBalances, 'platform');
    const items = Object.entries(groups).map(([platform, assets]) => {
      const netWorth = assets.reduce((acc, info) => acc + info.netWorth, 0);
      return {
        platform,
        netWorth,
        name: displayName(platform),
        ratio: (netWorth / netWorthInUSD) * 100,
      };
    });
    // maximum length is 7
    return items.slice(0, 7);
  }, [netWorthInUSD]);

  return (
    <Container>
      <div>
        <AssetRatioChart
          tokenBalances={tokenBalances}
          netWorthInUSD={netWorthInUSD}
        />
      </div>
      {assetRatioByPlatform.length && (
        <AssetCardList className="flex-1">
          {assetRatioByPlatform.map((item) => (
            <AssetRatioListItem key={item.platform} {...item} />
          ))}
        </AssetCardList>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-top: 24px;
  width: 100%;
  display: flex;

  @media screen and (max-width: 640px) {
    flex-direction: column;

    & > ul {
      margin-top: 24px;
      margin-left: 0;
    }
  }
`;
const AssetCardList = styled.ul`
  margin: 0;
  margin-left: 20px;
  padding: 10px 12px;
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  gap: 8px;

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
  box-shadow: inset 5px 5px 16px #0b0c0e, inset -5px -5px 16px #212426;
  border-radius: 8px;
`;
