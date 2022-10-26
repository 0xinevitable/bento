import BigNumber from 'bn.js';
import { Multicall } from 'klaytn-multicall';

import {
  DeFiStaking,
  KlaytnDeFiProtocolType,
  KlaytnDeFiType,
} from '@/defi/types/staking';

import IKSLP from '../abis/IKSLP.json';
import { klaytnChain } from '../constants';
import { getTokenInfo } from '../utils/getTokenInfo';

const provider = klaytnChain._provider;

export const getLPPoolBalance = async (
  _account: string,
  lpTokenBalance: string,
  pool: KLAYswap.Pool,
  multicall: Multicall,
): Promise<DeFiStaking> => {
  const kslp = new provider.klay.Contract(
    [
      ...IKSLP,
      {
        inputs: [],
        name: 'totalSupply',
        outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        type: 'function',
      },
    ] as any[],
    pool.exchange_address,
  );

  const liquidity = new BigNumber(lpTokenBalance);
  const calls = [kslp.methods.totalSupply(), kslp.methods.getCurrentPool()];
  const multicallResults = (await multicall.aggregate(calls)) as [
    [string],
    [string, string],
  ];
  const totalLiquidity = multicallResults?.[0]?.[0] || '0';
  const poolA = multicallResults?.[1]?.[0] || '0';
  const poolB = multicallResults?.[1]?.[1] || '0';

  let rawBalanceA = new BigNumber.BN(poolA)
    .mul(new BigNumber.BN(liquidity))
    .div(new BigNumber.BN(totalLiquidity));
  let rawBalanceB = new BigNumber.BN(poolB)
    .mul(new BigNumber.BN(liquidity))
    .div(new BigNumber.BN(totalLiquidity));

  const tokenInfoA = getTokenInfo(pool.tokenA.toLowerCase());
  const balanceA = Number(rawBalanceA) / 10 ** (tokenInfoA?.decimals || 18);
  const tokenInfoB = getTokenInfo(pool.tokenB.toLowerCase());
  const balanceB = Number(rawBalanceB) / 10 ** (tokenInfoB?.decimals || 18);

  let tokenAmounts: Record<string, number | undefined> = {};
  if (tokenInfoA) {
    tokenAmounts[tokenInfoA.address] = balanceA;
  }
  if (tokenInfoB) {
    tokenAmounts[tokenInfoB.address] = balanceB;
  }

  const tokens = [tokenInfoA || null, tokenInfoB || null];

  return {
    protocol: KlaytnDeFiProtocolType.KLAYSWAP,
    type: KlaytnDeFiType.KLAYSWAP_LP,
    prefix: tokens.flatMap((v) => v?.symbol || []).join(' + '),
    address: pool.exchange_address.toLowerCase(),
    tokens,
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
