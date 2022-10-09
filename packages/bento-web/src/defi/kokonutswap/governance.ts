// 1:1
// balances 로 가져오기
// https://prod.kokonut-api.com/govern/users/0x7777777141f111cf9F0308a63dbd9d0CaD3010C4
import axios from 'axios';

export const STAKED_KOKOS_ADDRESS =
  '0xc75456755d68058bf182bcd41c6d9650db4ce89e';

// FIXME:
export const getGovernanceStake = async (
  account: string,
  _dynamicAmount: number,
) => {
  const { data } = await axios
    .get<UserGovernanceResponse>(
      `https://prod.kokonut-api.com/govern/users/${account}`,
      {
        timeout: 2_500,
      },
    )
    .catch(() => ({ data: null }));
  const balance = _dynamicAmount;
  return {
    balance,
    rewards: Number(data?.ksdReward || 0),
    unstake: {
      claimable: Number(data?.unstakeInfo.completed || 0),
      pending: Number(data?.unstakeInfo.yet || 0),
    },
  };
};

export type UserGovernanceResponse = {
  unstakeInfo: {
    completed: string; // formatted
    yet: string; // formatted
  };
  ksdReward: string; // formatted
};
