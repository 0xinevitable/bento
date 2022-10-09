import { KlaytnChain } from '@bento/core/lib/chains';
import { KLAYTN_TOKENS, TokenInput } from '@bento/core/lib/tokens';
import axios from 'axios';

const klaytnChain = new KlaytnChain();

const getTokenInfo = (loweredAddress: string) => {
  if (loweredAddress === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee') {
    return { ...klaytnChain.currency, address: loweredAddress };
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

type LPBalance = {
  name: string;
  tokens: (TokenInput | null)[];
  wallet: number;
  walletValue: number;
  staked: number;
  stakedValue: number;
  rewards: number;
};
export const getLPPoolBalance = async (
  account: string,
  pool: KokonutSwap.Pool,
  pools: KokonutSwap.Pool[],
): Promise<LPBalance> => {
  const poolAddress = pool.address.toLowerCase();
  const [
    {
      data: { balances },
    },
    {
      data: { farmPools },
    },
  ] = await Promise.all([
    // FIXME: use `cachedAxios`
    axios.get<KokonutSwap.UserBalancesResponse>(
      `https://prod.kokonut-api.com/users/${account}`,
    ),
    axios.get<KokonutSwap.FarmPoolsResponse>(
      `https://prod.kokonut-api.com/farm/pools?address=${poolAddress}`,
    ),
  ]);
  const lpBalanceInWallet = Number(balances[pool.lpTokenAddress]);
  const farm = farmPools.find(
    (v) => v.poolAddress.toLowerCase() === poolAddress,
  );
  const lpStaked = Number(farm?.user.stakedAmount || 0);
  const lpValue = Number(farm?.user.stakedValue || 0);

  // get price with lpStaked, lpValue
  const lpPrice = lpValue / lpStaked;
  let lpBalanceInWalletValue = lpBalanceInWallet * lpPrice;
  if (isNaN(lpBalanceInWalletValue)) {
    lpBalanceInWalletValue = 0;
  }
  const claimableRewards = Number(farm?.user.claimableReward || 0);

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
    name: farm?.lpDisplaySymbol || pool.symbol,
    tokens: tokenInfos,
    wallet: lpBalanceInWallet,
    walletValue: lpBalanceInWalletValue,
    staked: lpStaked,
    stakedValue: lpValue,
    rewards: claimableRewards,
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
