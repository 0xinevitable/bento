import styled from 'styled-components';

import { DeFiStaking } from '@/defi/types/staking';

type DeFiStakingItemProps = {
  protocol: DeFiStaking;
};
export const DeFiStakingItem: React.FC<DeFiStakingItemProps> = ({
  protocol,
}) => {
  return (
    <Container>
      <Name>{protocol.type}</Name>
      <TokenLogoList>
        {protocol.tokens.map((token, index) => (
          <TokenLogo
            key={`token-${index}`}
            alt={token?.name || token?.symbol || 'Unknown'}
            src={token?.logo}
          />
        ))}
      </TokenLogoList>

      <span style={{ color: 'white', display: 'flex' }}>
        {protocol.staked.lpAmount} LP ({`$${protocol.staked.value || '?'}`})
        <br />
      </span>

      <span style={{ color: 'white', display: 'flex' }}>
        {!!protocol.staked.tokenAmounts &&
          Object.entries(protocol.staked.tokenAmounts).map(
            ([tokenContract, tokenAmount]) => {
              const token = protocol.tokens.find(
                (token) =>
                  !!token &&
                  'address' in token &&
                  token.address === tokenContract,
              );
              return (
                <span key={`token-${tokenContract}`}>
                  {`${tokenAmount || 0} ${token?.symbol}`}
                  &nbsp;
                </span>
              );
            },
          )}
      </span>
    </Container>
  );
};

const Container = styled.li`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 8px 0;
`;
const Name = styled.h5`
  color: white;
  font-size: 20px;
`;

const TokenLogoList = styled.div`
  display: flex;
`;
const TokenLogo = styled.img`
  width: 32px;
  min-width: 32px;
  height: 32px;

  &:not(:first-of-type) {
    margin-left: -8px;
  }
`;
