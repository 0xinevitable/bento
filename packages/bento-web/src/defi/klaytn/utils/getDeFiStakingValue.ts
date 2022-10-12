import { TokenInput } from '@bento/core';

import { GetCachedPrice } from '@/hooks/pricings';

import {
  AmountWithOptionalValue,
  DeFiStaking,
  NativeInput,
} from '@/defi/types/staking';

export const getDeFiStakingValue = (
  staking: DeFiStaking,
  getCachedPrice: GetCachedPrice,
) => {
  const { staked, rewards } = staking;
  let value =
    getAmountValue(staked, staking, getCachedPrice) +
    getAmountValue(rewards, staking, getCachedPrice);

  if (staking.unstake !== 'unavailable') {
    value += getAmountValue(
      staking.unstake?.claimable,
      staking,
      getCachedPrice,
    );
    value += getAmountValue(staking.unstake?.pending, staking, getCachedPrice);
  }

  return value;
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
