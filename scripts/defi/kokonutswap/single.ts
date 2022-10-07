// sKOKOS 0xc75456755D68058BF182BCd41c6d9650DB4ce89E
// 1:1
// balances 로 가져오기
// https://prod.kokonut-api.com/govern/users/0x7777777141f111cf9F0308a63dbd9d0CaD3010C4

type UserGovernanceResponse = {
  unstakeInfo: {
    completed: string; // formatted
    yet: string; // formatted
  };
  ksdReward: string; // formatted
};
