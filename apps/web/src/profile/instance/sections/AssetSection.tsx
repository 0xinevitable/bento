import styled from '@emotion/styled';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { Badge, Skeleton } from '@/components/system';

import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { Colors } from '@/styles';

import { Empty } from './Empty';

type Props = {
  tokenBalances: DashboardTokenBalance[];
};

export const AssetSection: React.FC<Props> = ({ tokenBalances }) => {
  const { t } = useTranslation('dashboard');

  return (
    <ul>
      {tokenBalances.length > 0 ? (
        <>
          <NetWorthContainer>
            <span>Token Net Worth</span>
            <span>
              {`$${tokenBalances
                .reduce((acc, item) => acc + item.netWorth, 0)
                .toLocaleString()}`}
            </span>
          </NetWorthContainer>

          {tokenBalances.map((item, index) => {
            return (
              <Container key={index}>
                <Logo src={item.logo} />
                <Information>
                  <Row>
                    <Title>{item.name}</Title>
                    <TokenNetWorth>{`$${item.netWorth.toLocaleString()}`}</TokenNetWorth>
                  </Row>
                  <Row>
                    <InlineBadge>{`$${item.price.toLocaleString()}`}</InlineBadge>
                    <TokenAmount>
                      {`${item.amount.toLocaleString()}`}
                      <span className="symbol">{` ${item.symbol}`}</span>
                    </TokenAmount>
                  </Row>
                </Information>
              </Container>
            );
          })}
        </>
      ) : (
        <Empty>{t('No Assets Found')}</Empty>
      )}
    </ul>
  );
};

const NetWorthContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
  width: 100%;

  display: flex;
  flex-direction: column;

  & > span:first-of-type {
    font-weight: 600;
    font-size: 18px;
    line-height: 100%;
    color: ${Colors.white};
  }

  & > span:last-of-type {
    margin-top: 8px;
    font-size: 30px;
    line-height: 36px;
    font-weight: bold;
    color: ${Colors.gray050};
  }
`;

const Container = styled.li`
  margin-top: 8px;
  display: flex;
  padding: 12px;
  border-radius: 8px;

  background: #16181a;
  background: linear-gradient(145deg, #141617, #181a1c);
  border: 1px solid #2a2e31;
`;

const Logo = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.28);
`;

const Information = styled.div`
  flex: 1;
  margin-left: 8px;
  z-index: 9;
  width: calc(100% - 30px - 8px);

  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: white;

  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
const InlineBadge = styled(Badge)`
  /* FIXME: */

  && {
    padding: 4px;
    padding-bottom: 3px;
    display: inline-flex;
    font-size: 12px;
    backdrop-filter: none;
  }
`;

const TokenNetWorth = styled.span`
  margin-left: 4px;

  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);
`;
const TokenAmount = styled.span`
  margin-left: 4px;

  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.45);

  @media (max-width: 400px) {
    span.symbol {
      display: none;
    }
  }
`;

// FIXME: Show skeletons again
const AssetSkeleton = styled(Skeleton)`
  width: 100%;
  height: 88px;
  margin-top: 8px;
  border-radius: 8px;
  align-self: center;
`;
