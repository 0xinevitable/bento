import { Balance } from '../types';

type BalanceObject = {
  wallet?: Balance;
  staked?: Balance;
  rewards?: Balance;
  unstake?:
    | {
        claimable: Balance;
        pending: Balance;
      }
    | null
    | 'unavailable';
};
export const withoutEmptyDeFiStaking = (obj: BalanceObject) => {
  if (
    isAmountExist(obj.wallet) ||
    isAmountExist(obj.staked) ||
    isAmountExist(obj.rewards)
  ) {
    return true;
  }
  if (!!obj.unstake && obj.unstake !== 'unavailable') {
    if (
      isAmountExist(obj.unstake.claimable) ||
      isAmountExist(obj.unstake.pending)
    ) {
      return true;
    }
  }
  return false;
};

const isAmountExist = (value?: Balance) => {
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
