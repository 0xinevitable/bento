import { TokenInput } from '@bento/core';

import { GetCachedPrice } from '@/hooks/useCachedPricings';

import {
  AmountWithOptionalValue,
  DeFiStaking,
  NativeInput,
} from '@/defi/types/staking';

export type Valuation = {
  wallet: number;
  staking: number;
  rewards: number;
  claimable: number | null;
  pending: number | null;
  total: number;
};
export const getDeFiStakingValue = (
  staking: DeFiStaking,
  getCachedPrice: GetCachedPrice,
): Valuation => {
  let valuation: Partial<Valuation> = {
    staking: getAmountValue(staking.staked, staking, getCachedPrice),
    rewards: getAmountValue(staking.rewards, staking, getCachedPrice),
  };

  valuation.claimable =
    staking.unstake !== 'unavailable'
      ? getAmountValue(staking.unstake?.claimable, staking, getCachedPrice)
      : null;
  valuation.pending =
    staking.unstake !== 'unavailable'
      ? getAmountValue(staking.unstake?.pending, staking, getCachedPrice)
      : null;

  return {
    ...valuation,
    total: Object.values(valuation).reduce<number>((a, b) => a + (b || 0), 0),
  } as Valuation;
};

export const getAmountValue = (
  value: AmountWithOptionalValue | 'unavailable' | null | undefined,
  staking: DeFiStaking,
  getCachedPrice: GetCachedPrice,
) => {
  if (!!value && value !== 'unavailable') {
    if (value.value) {
      return value.value;
    }
    if (!!value.tokenAmounts) {
      const tokens: (TokenInput | NativeInput | null)[] = [
        ...staking.tokens,
        ...(staking.relatedTokens || []),
      ];
      return Object.entries(value.tokenAmounts).reduce(
        (acc, [tokenAddress, tokenAmount]) => {
          const token = tokens.find(
            (item) =>
              !!item && 'address' in item && item.address === tokenAddress,
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
