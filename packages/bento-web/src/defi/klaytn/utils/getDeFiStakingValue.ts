import { AmountWithOptionalValue, DeFiStaking } from '@/defi/types/staking';

export const getDeFiStakingValue = (staking: DeFiStaking) => {
  const { staked, rewards } = staking;
  let value = getAmountValue(staked) + getAmountValue(rewards);

  if (staking.unstake !== 'unavailable') {
    value += getAmountValue(staking.unstake?.claimable);
    value += getAmountValue(staking.unstake?.pending);
  }

  return value;
};

export const getAmountValue = (
  value?: AmountWithOptionalValue | 'unavailable' | null,
) => {
  if (!!value && value !== 'unavailable') {
    if (value.value) {
      return value.value;
    }
    if (!!value.tokenAmounts) {
      // TODO:
      return 0;
    }
  }
  return 0;
};
