import React from 'react';
import styled from 'styled-components';

import { Skeleton } from '@/components/Skeleton';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';

type Props = { tokenBalances: DashboardTokenBalance[] };

export const AssetSection: React.FC<Props> = ({ tokenBalances }) => {
  return (
    <ul>
      {!!tokenBalances ? (
        tokenBalances.map((item) => {
          return (
            <Container>
              <Logo src={item.logo} />
              <Information>
                <Title>{item.name}</Title>
                <Description>
                  <span>{`$${item.netWorth.toLocaleString()}`}</span>
                  <span className="ml-2 text-white/60">
                    {`${item.amount.toLocaleString()} ${item.symbol}`}
                  </span>
                </Description>
              </Information>
            </Container>
          );
        })
      ) : (
        <>
          <AssetSkeleton />
          <AssetSkeleton />
          <AssetSkeleton />
        </>
      )}
    </ul>
  );
};

const Container = styled.li`
  margin-top: 8px;
  display: flex;
  padding: 12px;
  background-color: #262b34;
  border-radius: 8px;
`;

const Logo = styled.img`
  width: 64px;
  height: 64px;
  border-radius: 50%;
`;

const Information = styled.div`
  flex: 1;
  margin-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 9;
`;

const Title = styled.h3`
  margin: 0;
  font-weight: 700;
  font-size: 18px;
  line-height: 1.2;
  letter-spacing: -0.3px;
  color: white;
  word-break: keep-all;
`;

const Description = styled.p`
  margin: 0;
  margin-top: 4px;
  font-size: 15px;
  line-height: 1.2;
  letter-spacing: -0.5px;
  color: rgba(255, 255, 255, 0.8);
`;

const AssetSkeleton = styled(Skeleton)`
  width: 536px;
  height: 88px;
  margin-top: 8px;
  border-radius: 8px;
  align-self: center;
`;
