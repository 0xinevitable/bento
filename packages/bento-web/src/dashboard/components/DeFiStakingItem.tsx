import { Trans, useTranslation } from 'next-i18next';
import styled from 'styled-components';

import { DeFiStaking } from '@/defi/types/staking';
import { Colors } from '@/styles';

type DeFiStakingItemProps = {
  protocol: DeFiStaking;
};
export const DeFiStakingItem: React.FC<DeFiStakingItemProps> = ({
  protocol,
}) => {
  const { t } = useTranslation('dashboard');

  return (
    <Container style={{ color: 'white' }}>
      <Header>
        <TokenLogoList>
          {protocol.tokens.map((token, index) => (
            <TokenLogo
              key={`token-${index}`}
              alt={token?.name || token?.symbol || 'Unknown'}
              src={token?.logo}
            />
          ))}
        </TokenLogoList>
        {/* <Name>{t(`defi-type-${protocol.type}`)}</Name> */}
        <Name>
          <Trans
            t={t}
            i18nKey={`defi-type-${protocol.type}`}
            components={{
              validator: <ValidatorBadge />,
            }}
          />
        </Name>
      </Header>

      <span>wallet</span>
      {!protocol.wallet ? null : protocol.wallet === 'unavailable' ? (
        t('unavailable')
      ) : (
        <span style={{ color: 'white', display: 'flex' }}>
          {protocol.wallet.lpAmount} LP ({`$${protocol.wallet.value || '?'}`})
          <br />
          {!!protocol.wallet.tokenAmounts &&
            Object.entries(protocol.wallet.tokenAmounts).map(
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
      )}

      <span>staked</span>
      <span style={{ color: 'white', display: 'flex' }}>
        {protocol.staked.lpAmount} LP ({`$${protocol.staked.value || '?'}`})
        <br />
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
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const Name = styled.h5`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  color: white;
  font-size: 18px;
  font-weight: 500;
`;
const ValidatorBadge = styled.span`
  width: fit-content;
  padding: 4px 8px;
  background: rgba(51, 9, 17, 0.88);
  border: 1px solid #ff214a;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.44);
  border-radius: 36px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-weight: 600;
  font-size: 13px;
  line-height: 100%;

  text-align: center;
  letter-spacing: -0.5px;

  color: #ff214a;
`;

const TokenLogoList = styled.div`
  display: flex;
`;
const TokenLogo = styled.img`
  width: 32px;
  min-width: 32px;
  height: 32px;
  border: 1px solid rgba(0, 0, 0, 0.45);
  border-radius: 50%;

  &:not(:first-of-type) {
    margin-left: -8px;
  }
`;
