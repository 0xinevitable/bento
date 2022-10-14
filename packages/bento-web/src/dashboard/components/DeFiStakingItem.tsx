import { shortenAddress } from '@bento/common';
import { Trans, useTranslation } from 'next-i18next';
import { useMemo } from 'react';
import styled, { css } from 'styled-components';

import { DeFiStakingWithClientData } from '@/dashboard/hooks/useDeFis';
import { Colors } from '@/styles';

import { InlineBadge } from './InlineBadge';

const formatNumber = (value: number | null | undefined): string =>
  (value || 0).toLocaleString(undefined, {
    maximumSignificantDigits: 6,
  });

type DeFiStakingItemProps = {
  protocol: DeFiStakingWithClientData;
};
export const DeFiStakingItem: React.FC<DeFiStakingItemProps> = ({
  protocol,
}) => {
  const { t } = useTranslation('dashboard');

  const protocolTokens = useMemo(
    () => [...protocol.tokens, ...(protocol.relatedTokens || [])],
    [protocol],
  );

  return (
    <Container>
      <Header>
        <HeaderTitle>
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
        </HeaderTitle>

        <Valuation className="sys">
          {`$${formatNumber(protocol.valuation.total)}`}
        </Valuation>
      </Header>

      <AccountInfo>
        <AccountItem>
          <span className="field">{t('Account')}</span>
          <span className="sys">
            <InlineBadge>{shortenAddress(protocol.walletAddress)}</InlineBadge>
          </span>
        </AccountItem>
        <AccountItem>
          <span className="field">{t('Rep Contract')}</span>
          <span className="sys">
            <InlineBadge>{shortenAddress(protocol.address)}</InlineBadge>
          </span>
        </AccountItem>
      </AccountInfo>

      <InfoList>
        {!!protocol.wallet && (
          <InfoItem>
            <span className="field">{t('LPs without Farming')}</span>
            {protocol.wallet === 'unavailable' ? (
              <InfoValuation className="sys">{t('Unavailable')}</InfoValuation>
            ) : (
              <InfoValuation className="sys">
                {`$${formatNumber(protocol.valuation.wallet)}`}
                {typeof protocol.wallet.lpAmount === 'number' && (
                  <>
                    <br />
                    <SmallAmountInfo className="sys">
                      {`${formatNumber(protocol.wallet.lpAmount)} LP`}
                    </SmallAmountInfo>
                  </>
                )}
              </InfoValuation>
            )}
          </InfoItem>
        )}

        <InfoItem>
          <span className="field">{t('Staking')}</span>
          <InfoValuation className="sys">
            {`$${formatNumber(protocol.valuation.staking)}`}
            {typeof protocol.staked.lpAmount === 'number' && (
              <>
                <br />
                <SmallAmountInfo className="sys">
                  {`${formatNumber(protocol.staked.lpAmount)} LP`}
                </SmallAmountInfo>
              </>
            )}

            {!!protocol.staked.tokenAmounts && (
              <>
                <br />
                <SmallAmountInfo className="sys">
                  {Object.entries(protocol.staked.tokenAmounts).map(
                    ([tokenAddress, amount], index, arr) => {
                      const token = protocolTokens.find(
                        // @ts-ignore
                        (token) => token?.address === tokenAddress,
                      );
                      return `${formatNumber(amount)} ${
                        token?.symbol || '???'
                      } ${index < arr.length - 1 ? ' + ' : ''}`;
                    },
                  )}
                </SmallAmountInfo>
              </>
            )}
          </InfoValuation>
        </InfoItem>

        {!!protocol.rewards && (
          <InfoItem>
            <span className="field">{t('Rewards')}</span>
            {protocol.rewards === 'unavailable' ? (
              <InfoValuation className="sys">{t('Unavailable')}</InfoValuation>
            ) : (
              <InfoValuation className="sys">
                {`$${formatNumber(protocol.valuation.rewards)}`}
                {!!protocol.rewards.tokenAmounts && (
                  <>
                    <br />
                    <SmallAmountInfo className="sys">
                      {Object.entries(protocol.rewards.tokenAmounts).map(
                        ([tokenAddress, amount], index, arr) => {
                          const token = protocolTokens.find(
                            // @ts-ignore
                            (token) => token?.address === tokenAddress,
                          );
                          return `${formatNumber(amount)} ${
                            token?.symbol || '???'
                          } ${index < arr.length - 1 ? ' + ' : ''}`;
                        },
                      )}
                    </SmallAmountInfo>
                  </>
                )}
              </InfoValuation>
            )}
          </InfoItem>
        )}

        {!!protocol.unstake && (
          <InfoItem>
            <span className="field">{t('Unstaking')}</span>
            {protocol.unstake === 'unavailable' ? (
              <InfoValuation className="sys">{t('Unavailable')}</InfoValuation>
            ) : (
              <>
                <span className="item">
                  <span className="title">{t('Claimable')}</span>
                  <InfoValuation className="sys">
                    {`$${formatNumber(protocol.valuation.claimable)}`}

                    {protocol.unstake.claimable !== 'unavailable' &&
                      protocol.unstake.claimable?.tokenAmounts && (
                        <>
                          <br />
                          <SmallAmountInfo className="sys">
                            {Object.entries(
                              protocol.unstake.claimable.tokenAmounts,
                            ).map(([tokenAddress, amount], index, arr) => {
                              const token = protocolTokens.find(
                                // @ts-ignore
                                (token) => token?.address === tokenAddress,
                              );
                              return `${formatNumber(amount)} ${
                                token?.symbol || '???'
                              } ${index < arr.length - 1 ? ' + ' : ''}`;
                            })}
                          </SmallAmountInfo>
                        </>
                      )}
                  </InfoValuation>
                </span>

                <span className="item">
                  <span className="title">{t('Pending')}</span>
                  <InfoValuation className="sys">
                    {`$${formatNumber(protocol.valuation.pending)}`}

                    {protocol.unstake.pending !== 'unavailable' &&
                      protocol.unstake.pending?.tokenAmounts && (
                        <>
                          <br />
                          <SmallAmountInfo className="sys">
                            {Object.entries(
                              protocol.unstake.pending.tokenAmounts,
                            ).map(([tokenAddress, amount], index, arr) => {
                              const token = protocolTokens.find(
                                // @ts-ignore
                                (token) => token?.address === tokenAddress,
                              );
                              return `${formatNumber(amount)} ${
                                token?.symbol || '???'
                              } ${index < arr.length - 1 ? ' + ' : ''}`;
                            })}
                          </SmallAmountInfo>
                        </>
                      )}
                  </InfoValuation>
                </span>
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
  justify-content: space-between;
`;
const HeaderTitle = styled.div`
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
  font-weight: 600;

  &:lang(ko) {
    letter-spacing: -0.8px;
  }
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
  ${fixedSize('34px')}
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

const Valuation = styled.span`
  font-weight: bold;
  font-size: 18px;
  line-height: 20px;
  font-weight: bold;
  color: ${Colors.gray200};
`;

const AccountInfo = styled.div`
  margin-top: 2px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 16px;
`;
const AccountItem = styled.div`
  display: flex;
  align-items: center;
  font-size: 14.5px;

  & > span.field {
    color: ${Colors.gray200};
    font-weight: 500;
  }
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

  span.field {
    font-weight: 600;
    color: ${Colors.gray200};
    margin-bottom: 6px;
  }

  span.item {
    &:not(:last-of-type) {
      margin-bottom: 4px;
    }
  }

  span.title {
    margin-right: 8px;
    color: ${Colors.gray400};
  }
`;
const InfoValuation = styled(Valuation)`
  color: ${Colors.gray100};
`;
const SmallAmountInfo = styled.span`
  color: ${Colors.gray500};
  font-weight: 500;
  font-size: 16px;
`;
