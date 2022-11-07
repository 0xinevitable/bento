import { AmountWithOptionalValue, DeFiStaking } from '../types/staking';

export const withoutEmptyDeFiStaking = (staking: DeFiStaking) => {
  if (
    isAmountExist(staking.wallet) ||
    isAmountExist(staking.staked) ||
    isAmountExist(staking.rewards)
  ) {
    return true;
  }
  if (!!staking.unstake && staking.unstake !== 'unavailable') {
    if (
      isAmountExist(staking.unstake.claimable) ||
      isAmountExist(staking.unstake.pending)
    ) {
      return true;
    }
  }
  return false;
};

const isAmountExist = (
  value: AmountWithOptionalValue | 'unavailable' | null,
) => {
  if (!!value && value !== 'unavailable') {
    if ((value.lpAmount || 0) > 0) {
      return true;
    }
    if (
      !!value.tokenAmounts &&
      Object.values(value.tokenAmounts).some((v) => (v || 0) > 0)
    ) {
      return true;
    }
  }
  return false;
};
