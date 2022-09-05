import React from 'react';
import styled from 'styled-components';

import { Badge } from '@/components/Badge';
import { Skeleton } from '@/components/Skeleton';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';

type Props = {
  tokenBalances: DashboardTokenBalance[];
};

export const AssetSection: React.FC<Props> = ({ tokenBalances }) => {
  return (
    <ul>
      {tokenBalances.length > 0 ? (
        <>
          <Container>
            <Information>
              <Row>
                <Title>Net Worth</Title>
                <TotalWorth>{`$${tokenBalances
                  .reduce((acc, item) => acc + item.netWorth, 0)
                  .toLocaleString()}`}</TotalWorth>
              </Row>
            </Information>
          </Container>
          {tokenBalances.map((item, index) => {
            return (
              <Container key={index}>
                <Logo src={item.logo} />
                <Information>
                  <Row>
                    <Title>{item.name}</Title>
                    <NetWorth>{`$${item.netWorth.toLocaleString()}`}</NetWorth>
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
        <Empty>No Assets Found</Empty>
      )}
    </ul>
  );
};

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
  padding: 4px;
  padding-bottom: 3px;
  display: inline-flex;
  font-size: 12px;
  backdrop-filter: none;
`;

const NetWorth = styled.span`
  margin-left: 4px;

  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);
`;

const TotalWorth = styled(NetWorth)`
  font-size: 17px;
  letter-spacing: 0px;
`;

const TokenAmount = styled.span`
  margin-left: 4px;

  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.45);

  @media screen and (max-width: 400px) {
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

const Empty = styled.span`
  width: 100%;
  display: flex;
  justify-content: center;
  color: white;
`;
