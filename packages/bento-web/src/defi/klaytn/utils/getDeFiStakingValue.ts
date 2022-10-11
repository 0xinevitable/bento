import { AmountWithOptionalValue, DeFiStaking } from '@/defi/types/staking';

export const getDeFiStakingValue = (staking: DeFiStaking) => {
  const { staked, rewards } = staking;
  let value = getValue(staked) + getValue(rewards);

  if (staking.unstake !== 'unavailable') {
    value += getValue(staking.unstake?.claimable);
    value += getValue(staking.unstake?.pending);
  }

  return value;
};

const getValue = (value?: AmountWithOptionalValue | 'unavailable' | null) => {
  if (!!value && value !== 'unavailable') {
    if (value.value) {
      return value.value;
    }
    if (!!value.tokenAmounts) {
      return 0;
    }
  }
  return 0;
};
