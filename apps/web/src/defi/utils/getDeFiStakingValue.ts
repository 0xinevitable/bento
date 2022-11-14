import { GetCachedPrice } from '@/hooks/pricings';

import { Balance, ProtocolAccountInfo, TokenInput } from '@/constants/adapters';

export type Valuation = {
  wallet: number;
  staking: number;
  rewards: number;
  claimable: number | null;
  pending: number | null;
  total: number;
};

export const getDeFiStakingValue = (
  accountInfo: ProtocolAccountInfo,
  getCachedPrice: GetCachedPrice,
): Valuation => {
  let valuation: Valuation = {
    wallet: getAmountValue(accountInfo.wallet, accountInfo, getCachedPrice),
    staking: getAmountValue(accountInfo.staked, accountInfo, getCachedPrice),
    rewards: getAmountValue(accountInfo.rewards, accountInfo, getCachedPrice),
    claimable: null,
    pending: null,
    total: 0,
  };

  valuation.claimable =
    accountInfo.unstake !== 'unavailable'
      ? getAmountValue(
          accountInfo.unstake?.claimable,
          accountInfo,
          getCachedPrice,
        )
      : null;

  valuation.pending =
    accountInfo.unstake !== 'unavailable'
      ? getAmountValue(
          accountInfo.unstake?.pending,
          accountInfo,
          getCachedPrice,
        )
      : null;

  valuation.total = Object.values(valuation).reduce<number>(
    (a, b) => a + (b || 0),
    0,
  );

  return valuation;
};

export const getAmountValue = (
  value: Balance | undefined,
  staking: ProtocolAccountInfo,
  getCachedPrice: GetCachedPrice,
) => {
  if (!!value && value !== 'unavailable') {
    if (value.value) {
      return value.value;
    }
    if (!!value.tokenAmounts) {
      const tokens: (TokenInput | null)[] = [
        ...staking.tokens,
        ...(staking.relatedTokens || []),
      ];
      return Object.entries(value.tokenAmounts).reduce(
        (acc, [tokenAddress, tokenAmount]) => {
          const token = tokens.find(
            (item) => !!item && item.ind === tokenAddress,
          );
          if (!token) {
            return acc;
          }
          const price =
            'coinGeckoId' in token && !!token.coinGeckoId
              ? getCachedPrice(token.coinGeckoId)
              : 0;
          return acc + (tokenAmount || 0) * price;
        },
        0,
      );
    }
  }
  return 0;
};
