import { useAxiosSWR } from '@/utils/useAxiosSWR';
import { wallets } from '@dashboard/core/lib/config';
import React, { useMemo } from 'react';
import styled from 'styled-components';

const LandingPage = () => {
  const [ethereumWalletQuery, klaytnWalletQuery] = useMemo(() => {
    const addrs = wallets.reduce(
      (acc, wallet) => {
        if (wallet.type !== 'erc') {
          return acc;
        }
        if (wallet.networks.includes('ethereum')) {
          return { ...acc, ethereum: [...acc.ethereum, wallet.address] };
        }
        if (wallet.networks.includes('klaytn')) {
          return { ...acc, klaytn: [...acc.klaytn, wallet.address] };
        }
        return acc;
      },
      { klaytn: [], ethereum: [] },
    );

    return [addrs.ethereum.join(','), addrs.klaytn.join(',')];
  }, []);

  const { data: ethereumBalance } = useAxiosSWR(
    `/api/erc/ethereum/${ethereumWalletQuery}`,
  );
  const { data: klaytnBalance } = useAxiosSWR(
    `/api/erc/klaytn/${klaytnWalletQuery}`,
  );

  return (
    <Container>
      <Title>Multichain Dashboard</Title>
      {JSON.stringify(ethereumBalance)}
      {JSON.stringify(klaytnBalance)}
    </Container>
  );
};

export default LandingPage;

const Container = styled.div``;

const Title = styled.h1`
  font-size: 24px;
`;
