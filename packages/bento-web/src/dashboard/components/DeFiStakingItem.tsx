import { shortenAddress } from '@bento/common';
import { Trans, useTranslation } from 'next-i18next';
import styled, { css } from 'styled-components';

import { DeFiStaking } from '@/defi/types/staking';
import { Colors } from '@/styles';

const formatNumber = (value: number | null | undefined): string =>
  (value || 0).toLocaleString(undefined, {
    maximumSignificantDigits: 6,
  });

type DeFiStakingItemProps = {
  protocol: DeFiStaking;
};
export const DeFiStakingItem: React.FC<DeFiStakingItemProps> = ({
  protocol,
}) => {
  const { t } = useTranslation('dashboard');

  return (
    <Container>
      <Header>
        <TokenLogoList>
          {protocol.tokens.map((token, index) => (
            <TokenLogoWrapper key={`token-${index}`}>
              <TokenLogo
                alt={token?.name || token?.symbol || 'Unknown'}
                src={token?.logo}
              />
            </TokenLogoWrapper>
          ))}
        </TokenLogoList>

        <Name>
          {!!protocol.prefix && `${protocol.prefix} `}
          <Trans
            t={t}
            i18nKey={`defi-type-${protocol.type}`}
            components={{
              validator: <ValidatorBadge />,
            }}
          />
        </Name>
      </Header>

      <RepresentativeContractAddress>
        {shortenAddress(protocol.address)}
      </RepresentativeContractAddress>

      <InfoList>
        {!!protocol.wallet && (
          <InfoItem>
            <span>wallet</span>
            {protocol.wallet === 'unavailable' ? (
              t('unavailable')
            ) : (
              <span>
                {formatNumber(protocol.wallet.lpAmount)} LP (
                {`$${protocol.wallet.value || '?'}`})
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
                          {`${formatNumber(tokenAmount)} ${token?.symbol}`}
                          &nbsp;
                        </span>
                      );
                    },
                  )}
              </span>
            )}
          </InfoItem>
        )}

        <InfoItem>
          <span>staked</span>
          <span>
            {formatNumber(protocol.staked.lpAmount)} LP (
            {`$${formatNumber(protocol.staked.value) || '?'}`})
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
                      {`${formatNumber(tokenAmount)} ${token?.symbol}`}
                      &nbsp;
                    </span>
                  );
                },
              )}
          </span>
        </InfoItem>

        {!!protocol.unstake && (
          <InfoItem>
            <span>unstake</span>
            {protocol.unstake === 'unavailable' ? (
              t('unavailable')
            ) : (
              <>
                {!!protocol.unstake.claimable && (
                  <>
                    <span>claimable</span>
                    <span>
                      {protocol.unstake.claimable === 'unavailable' ? (
                        t('unavailable')
                      ) : (
                        <>
                          {formatNumber(protocol.unstake.claimable.lpAmount)} LP
                          (
                          {`$${
                            formatNumber(protocol.unstake.claimable.value) ||
                            '?'
                          }`}
                          )
                          <br />
                          {!!protocol.unstake.claimable.tokenAmounts &&
                            Object.entries(
                              protocol.unstake.claimable.tokenAmounts,
                            ).map(([tokenContract, tokenAmount]) => {
                              const token = protocol.tokens.find(
                                (token) =>
                                  !!token &&
                                  'address' in token &&
                                  token.address === tokenContract,
                              );
                              return (
                                <span key={`token-${tokenContract}`}>
                                  {`${formatNumber(tokenAmount)} ${
                                    token?.symbol
                                  }`}
                                  &nbsp;
                                </span>
                              );
                            })}
                        </>
                      )}
                    </span>
                  </>
                )}

                {!!protocol.unstake.pending && (
                  <>
                    <span>pending</span>
                    <span>
                      {protocol.unstake.pending === 'unavailable' ? (
                        t('unavailable')
                      ) : (
                        <>
                          {formatNumber(protocol.unstake.pending.lpAmount)} LP (
                          {`$${
                            formatNumber(protocol.unstake.pending.value) || '?'
                          }`}
                          )
                          <br />
                          {!!protocol.unstake.pending.tokenAmounts &&
                            Object.entries(
                              protocol.unstake.pending.tokenAmounts,
                            ).map(([tokenContract, tokenAmount]) => {
                              const token = protocol.tokens.find(
                                (token) =>
                                  !!token &&
                                  'address' in token &&
                                  token.address === tokenContract,
                              );
                              return (
                                <span key={`token-${tokenContract}`}>
                                  {`${formatNumber(tokenAmount)} ${
                                    token?.symbol
                                  }`}
                                  &nbsp;
                                </span>
                              );
                            })}
                        </>
                      )}
                    </span>
                  </>
                )}
              </>
            )}
          </InfoItem>
        )}
      </InfoList>
    </Container>
  );
};

const Container = styled.li`
  padding: 8px 12px;
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 6px;

  border-radius: 8px;
  border: 1px solid ${Colors.gray700};
  background-color: ${Colors.gray850};
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
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.8px;
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
const fixedSize = (size: string) => css`
  width: ${size};
  min-width: ${size};
  max-width: ${size};
  height: ${size};
  max-height: ${size};
  max-height: ${size};
`;
const TokenLogoWrapper = styled.div`
  ${fixedSize('40px')}
  padding: 1px;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.45);
  border-radius: 50%;

  &:not(:first-of-type) {
    margin-left: -8px;
  }
`;
const TokenLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RepresentativeContractAddress = styled.span`
  color: ${Colors.gray200};
`;

const InfoList = styled.ul`
  width: 100%;
  display: flex;
  gap: 8px;
`;
const InfoItem = styled.li`
  padding: 10px;

  display: flex;
  flex-direction: column;
  flex: 1;

  border-radius: 8px;
  background-color: ${Colors.gray800};
  color: ${Colors.gray400};
`;
