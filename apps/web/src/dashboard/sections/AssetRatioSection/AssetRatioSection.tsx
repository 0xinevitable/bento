import styled from '@emotion/styled';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useMemo } from 'react';

import { AnimatedToolTip } from '@/components/system';

import { NETWORKS } from '@/constants/networks';
import { Breakpoints } from '@/dashboard/constants/breakpoints';
import { displayName } from '@/dashboard/constants/platform';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { ServiceData } from '@/defi/types/staking';
import { Colors } from '@/styles';

const AVAILABLE_COLORS = ['#FF439D', '#FF77B8', '#ff8181', '#FAB4F9'];

type AssetRatioSectionProps = {
  netWorthInWallet: number;
  netWorthInProtocols: number;
  tokenBalances: DashboardTokenBalance[];
  services: ServiceData[];
};
export const AssetRatioSection: React.FC<AssetRatioSectionProps> = ({
  tokenBalances,
  netWorthInWallet,
  netWorthInProtocols,
  services,
}) => {
  const { t } = useTranslation('dashboard');

  const netWorthInUSD = useMemo(
    () => netWorthInWallet + netWorthInProtocols,
    [netWorthInWallet, netWorthInProtocols],
  );

  const summary = useMemo(() => {
    const [nfts, tokens] = tokenBalances.reduce(
      (acc, cur) => {
        if (cur.platform === 'opensea') {
          acc[0].push(cur);
        } else {
          acc[1].push(cur);
        }
        return acc;
      },
      [[], []] as DashboardTokenBalance[][],
    );

    const protocols = services.map((v) => v.protocols).flat();

    const items = [
      {
        name: 'pa_nfts',
        netWorth: nfts.reduce((acc, cur) => acc + cur.netWorth, 0),
      },
      {
        name: 'pa_tokens',
        netWorth: tokens.reduce((acc, cur) => acc + cur.netWorth, 0),
      },
      {
        name: 'pa_defi',
        netWorth: protocols.reduce((acc, cur) => acc + cur.netWorth, 0),
      },
    ].flatMap((v) => {
      const ratio = (v.netWorth / netWorthInUSD) * 100;
      return ratio > 0 ? { ...v, ratio } : [];
    });
    items.sort((a, b) => b.ratio - a.ratio);
    return items;
  }, [tokenBalances, services]);

  return (
    <Container>
      <Information>
        <Field>{t('Net Worth')}</Field>
        <Title>{`$${netWorthInUSD.toLocaleString()}`}</Title>
      </Information>

      <Information style={{ marginTop: 'auto', gap: 16 }}>
        <Field>{t('Portfolio Allocation')}</Field>
        <BarList>
          {summary.map((item, index) => (
            <AnimatedToolTip
              key={item.name}
              label={
                <>
                  <BreakdownLabel>{t(item.name)}</BreakdownLabel>{' '}
                  <BreakdownValue>
                    {`$${item.netWorth.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                  </BreakdownValue>
                </>
              }
              placement="top-start"
            >
              <Bar
                key={item.name}
                style={{
                  background: AVAILABLE_COLORS[index] || '#5b739b',
                  width: `${item.ratio.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}%`,
                }}
              />
            </AnimatedToolTip>
          ))}
        </BarList>

        <BreakdownList>
          {summary.map((item, index) => (
            <AnimatedToolTip
              key={item.name}
              label={
                <>
                  <BreakdownLabel>{t(item.name)}</BreakdownLabel>{' '}
                  <BreakdownValue>
                    {`$${item.netWorth.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`}
                  </BreakdownValue>
                </>
              }
              placement="top-start"
            >
              <BreakdownItem
                key={item.name}
                style={{ cursor: 'pointer', width: 'fit-content' }}
              >
                <BreakdownColorIndicator
                  style={{ background: AVAILABLE_COLORS[index] || '#5b739b' }}
                />
                <BreakdownLabel>{t(item.name)}</BreakdownLabel>
                <BreakdownValue>
                  {`${item.ratio.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}%`}
                </BreakdownValue>
              </BreakdownItem>
            </AnimatedToolTip>
          ))}
        </BreakdownList>
      </Information>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  padding: 28px 24px;
  gap: 24px;
  flex: 1;
  z-index: 0;

  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  border-radius: 36px;
  background: linear-gradient(180deg, #14191e 0%, #0f1214 100%);

  @media (max-width: ${Breakpoints.Tablet}px) {
    max-width: 100%;
    width: 100%;
    flex: unset;
  }

  @media (max-width: ${Breakpoints.Mobile}px) {
    padding: 24px 20px;
  }

  @media (max-width: ${Breakpoints.Tiny}px) {
    padding: 20px 16px;
    border-radius: 28px;
  }
`;

const Information = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;
const Field = styled.span`
  font-weight: 700;
  font-size: 20px;
  line-height: 100%;
  color: ${Colors.gray200};
`;
const Title = styled.h2`
  font-weight: 900;
  font-size: 48px;
  line-height: 100%;
  color: ${Colors.gray050};

  @media (max-width: ${Breakpoints.Mobile}px) {
    font-size: 32px;
    line-height: 120%;
  }

  @media (max-width: ${Breakpoints.Tiny}px) {
    font-size: 28px;
  }
`;

const BarList = styled.ul`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
`;
const Bar = styled.li`
  min-width: 12px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
`;

const BreakdownList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const BreakdownItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const BreakdownColorIndicator = styled.div`
  width: 20px;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0, 0, 0, 0.25);
`;
const BreakdownLabel = styled.span`
  font-weight: 700;
  font-size: 18px;
  line-height: 100%;
  text-align: center;
  color: ${Colors.gray400};
`;
const BreakdownValue = styled(BreakdownLabel)`
  font-weight: 900;
  color: ${Colors.gray100};
`;
