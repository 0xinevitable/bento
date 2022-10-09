import { EEEE_ADDRESS } from '@bento/core';
import { KLAYTN_TOKENS, TokenInput } from '@bento/core/lib/tokens';
import axios from 'axios';

import { klaytnChain } from '../constants';
import { DeFiStaking, KlaytnDeFiType, NativeInput } from '../types/staking';
import { KSD_ADDRESS } from './constants';

const getTokenInfo = (
  loweredAddress: string,
): NativeInput | TokenInput | null => {
  if (loweredAddress === EEEE_ADDRESS) {
    return klaytnChain.currency;
  }
  const tokenInfo = KLAYTN_TOKENS.find((k) => k.address === loweredAddress);
  if (tokenInfo) {
    return tokenInfo;
  }
  return null;
};

export const getLPPoolList = async () => {
  const { data } = await axios.get<KokonutSwap.PoolListResponse>(
    'https://prod.kokonut-api.com/pools',
  );
  return data.pools;
};

export const getLPPoolBalance = async (
  _account: string,
  lpTokenBalance: string,
  pool: KokonutSwap.Pool,
  pools: KokonutSwap.Pool[],
): Promise<DeFiStaking> => {
  const poolAddress = pool.address.toLowerCase();
  const {
    data: { farmPools },
  } = await axios.get<KokonutSwap.FarmPoolsResponse>(
    `https://prod.kokonut-api.com/farm/pools?address=${poolAddress}`,
  );
  const farm = farmPools.find(
    (v) => v.poolAddress.toLowerCase() === poolAddress,
  );
  const lpStaked = Number(farm?.user.stakedAmount || 0);
  const lpValue = Number(farm?.user.stakedValue || 0);

  // get price with lpStaked, lpValue
  const lpPrice = lpValue / lpStaked;
  const lpBalanceInWallet = Number(lpTokenBalance);
  let lpBalanceInWalletValue = lpBalanceInWallet * lpPrice;
  if (isNaN(lpBalanceInWalletValue)) {
    lpBalanceInWalletValue = 0;
  }
  const claimableRewardsInKSD = Number(farm?.user.claimableReward || 0);

  const tokenInfos = pool.coins.flatMap((coinAddr) => {
    const address = coinAddr.toLowerCase();
    const tokenInfo = getTokenInfo(address);
    if (tokenInfo) {
      return tokenInfo;
    }
    const lpTokenPool = pools.find(
      (v) => v.lpTokenAddress.toLowerCase() === address,
    );
    if (lpTokenPool) {
      return lpTokenPool.coins.map((v) => getTokenInfo(v.toLowerCase()));
    }
    return null;
  });

  return {
    type: KlaytnDeFiType.KOKONUTSWAP_LP,
    address: pool.lpTokenAddress,
    tokens: tokenInfos,
    wallet: {
      value: lpBalanceInWalletValue,
      lpAmount: lpBalanceInWallet,
    },
    staked: {
      value: lpValue,
      lpAmount: lpStaked,
    },
    rewards: {
      tokenAmounts: {
        [KSD_ADDRESS]: claimableRewardsInKSD,
      },
    },
    unstake: null,
  };
};

declare module KokonutSwap {
  export interface Liquidity {
    coin: string;
    amount: string;
  }

  export interface Pool {
    address: string;
    symbol: string;
    poolType: string;
    lpTokenAddress: string;
    stakingPoolAddress?: string;
    managerAddress?: string;
    coins: string[];
    coinsUnderlying: string[];
    adminFee?: string;
    swapFee?: string;
    deprecated: boolean;
    liquidity: Liquidity[];
    tvl: string;
    lpTokenVirtualPrice: string;
    lpTokenRealPrice: string;
    lpTokenTotalSupply: string;
    volume24hr: string;
    volume24hrOnlySwap: string;
    rewardFee24hr: string;
    baseApr: string;
    stakingApr?: string;
    user: User | null;
    swapMidFee?: string;
    swapOutFee?: string;
    priceOracle?: string;
    priceScale?: string;
    extendedContractAddress?: string;
    aklayApr?: string;
  }

  export interface User {
    stakedAmount: string;
    stakedValue: string;
    claimableReward: string;
  }

  export interface FarmPool {
    poolAddress: string;
    stakingPoolAddress: string;
    lpTokenAddress: string;
    type: string;
    lpDisplaySymbol: string;
    getLPLink: string;
    lpCoins: string[];
    totalLiquidity: string;
    stakingRewardCoinAddress: string;
    poolRateWeek: string;
    baseApr: string;
    stakingApr: string;
    fixedKSDAprEndsAt: Date;
    user: User;
    deprecated: boolean;
    aklayApr: string;
  }

  export interface PoolListResponse {
    pools: Pool[];
  }

  export interface UserBalancesResponse {
    balances: Record<string, string>; // formatted
  }

  export interface FarmPoolsResponse {
    farmPools: FarmPool[];
  }
}
