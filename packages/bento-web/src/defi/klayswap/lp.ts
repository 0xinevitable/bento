import { KlaytnChain } from '@bento/core/lib/chains';
import { KLAYTN_TOKENS } from '@bento/core/lib/tokens';
import BigNumber from 'bn.js';

import IERC20 from '../abis/IERC20.json';
import IKSLP from '../abis/IKSLP.json';
import { DeFiStaking, KlaytnDeFiType } from '../types/staking';

const klaytnChain = new KlaytnChain();
const provider = klaytnChain._provider;

export const getLPPoolBalance = async (
  _account: string,
  lpTokenBalance: string,
  pool: KLAYswap.Pool,
): Promise<DeFiStaking> => {
  const kslp = new provider.klay.Contract(
    [...IKSLP, ...IERC20] as any[],
    pool.exchange_address,
  );

  const liquidity = new BigNumber(lpTokenBalance);
  const totalLiquidity = await kslp.methods.totalSupply().call();
  const { 0: poolA, 1: poolB } = await kslp.methods.getCurrentPool().call();

  let rawBalanceA = new BigNumber.BN(poolA)
    .mul(new BigNumber.BN(liquidity))
    .div(new BigNumber.BN(totalLiquidity));
  let rawBalanceB = new BigNumber.BN(poolB)
    .mul(new BigNumber.BN(liquidity))
    .div(new BigNumber.BN(totalLiquidity));

  const tokenInfoA = KLAYTN_TOKENS.find((v) => v.address === pool.tokenA);
  const balanceA = Number(rawBalanceA) / 10 ** (tokenInfoA?.decimals || 18);
  const tokenInfoB = KLAYTN_TOKENS.find((v) => v.address === pool.tokenB);
  const balanceB = Number(rawBalanceB) / 10 ** (tokenInfoB?.decimals || 18);

  let tokenAmounts: Record<string, number | undefined> = {};
  if (tokenInfoA) {
    tokenAmounts[tokenInfoA.address] = balanceA;
  }
  if (tokenInfoB) {
    tokenAmounts[tokenInfoB.address] = balanceB;
  }

  return {
    type: KlaytnDeFiType.KLAYSWAP_LP,
    address: pool.exchange_address,
    tokens: [tokenInfoA || null, tokenInfoB || null],
    wallet: null,
    staked: {
      lpAmount: Number(liquidity) / 10 ** 18,
      tokenAmounts,
    },
    // TODO:
    rewards: 'unavailable',
    unstake: null,
  };
};

export declare module KLAYswap {
  export interface Common {
    factoryMined: string;
    singlePoolTotalMined: string;
    votingKSP: string;
    dailyMinedKsp: string;
    votingKSPAmount: string;
    date: string;
    blockNo: number;
    lastEpochBlock: string;
    stakingMining: string;
    singlePoolMining: string;
    poolMining: string;
    curVol: string;
    curTvl: string;
    stakingVol: string;
    tokenCnt: number;
  }

  export interface Category {
    flag: string;
    title: string;
    icon: string;
  }

  export interface Pool {
    id: number;
    exchange_address: string;
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
    lpPrice: string;
    supply: string;
    poolVolume: string;
    lastHourTradeA: string;
    lastHourTradeB: string;
    lastHourTradeTotalVolume: string;
    decimals: string;
    fee: string;
    lastMined: string;
    miningIndex: string;
    isKSPPool: boolean;
    isXRPPool: boolean;
    isETHPool: boolean;
    isKLAYPool: boolean;
    isStablePool: boolean;
    isDropsPool: boolean;
    isDropsTag: boolean;
    dailyMining: string;
    miningRate: string;
    kspRewardRate: string;
    airdropRewardRate: any[];
    feeRewardRate: string;
  }

  export interface RecentPoolInfo {
    common: Common;
    recentPool: any[][];
    categories: Category[];
  }
}
