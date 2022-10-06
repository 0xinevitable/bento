import { KLAYTN_TOKENS } from '@bento/core/lib/tokens';
import axios from 'axios';
import BigNumber from 'bn.js';
import Caver from 'caver-js';

import IERC20 from './abis/IERC20.json';
import IKSLP from './abis/IKSLP.json';

export const getPoolList = async () => {
  const { data } = await axios.get<KLAYswap.RecentPoolInfo>(
    'https://s.klayswap.com/stat/recentPoolInfo.min.json',
  );

  const fields = data.recentPool[0] as string[];
  const pools = data.recentPool.slice(1).map((pool) => {
    const poolObj: any = {};
    fields.forEach((field, index) => {
      poolObj[field] = pool[index];
    });
    return poolObj as KLAYswap.Pool;
  });

  return pools;
};

export const getPools = async () => {
  const pool = {
    id: 23,
    exchange_address: '0xc320066b25b731a11767834839fe57f9b2186f84',
    tokenA: '0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167',
    tokenB: '0x5c74070fdea071359b86082bd9f9b3deaafbe32b',
    amountA: '9540518643381',
    amountB: '9580954516632679071395065',
    lpPrice: '2.0086',
    supply: '9470897214517',
    poolVolume: '19049807.653',
    lastHourTradeA: '17782931170',
    lastHourTradeB: '23198562225364834077772',
    lastHourTradeTotalVolume: '41445.782',
    decimals: '6',
    fee: '0.3',
    lastMined: '50759829950000000000000000',
    miningIndex: '42184188381584435587821141564',
    isKSPPool: false,
    isXRPPool: false,
    isETHPool: false,
    isKLAYPool: false,
    isStablePool: true,
    isDropsPool: false,
    isDropsTag: false,
    dailyMining: '1151289906993612344160',
    miningRate: '1.5676605487385789',
    kspRewardRate: '1.59263068893850936',
    airdropRewardRate: [],
    feeRewardRate: '0.22956339810244595',
  };

  const provider = new Caver(
    'https://public-node-api.klaytnapi.com/v1/cypress',
  );
  const kslp = new provider.klay.Contract(
    [...IKSLP, ...IERC20] as any[],
    pool.exchange_address,
  );

  const liquidity = await kslp.methods
    .balanceOf('0x7777777141f111cf9F0308a63dbd9d0CaD3010C4')
    .call();
  const totalLiquidity = await kslp.methods.totalSupply().call();
  const { 0: poolA, 1: poolB } = await kslp.methods.getCurrentPool().call();
  console.log(liquidity, totalLiquidity);
  let rawBalanceA = new BigNumber.BN(poolA)
    .mul(new BigNumber.BN(liquidity))
    .div(new BigNumber.BN(totalLiquidity));
  let rawBalanceB = new BigNumber.BN(poolB)
    .mul(new BigNumber.BN(liquidity))
    .div(new BigNumber.BN(totalLiquidity));

  const tokenInfoA = KLAYTN_TOKENS.find((v) => v.address === pool.tokenA);
  const balanceA = Number(rawBalanceA) / 10 ** (tokenInfoA?.decimals || 18);
  const tokenA = { ...tokenInfoA, balance: balanceA };
  const tokenInfoB = KLAYTN_TOKENS.find((v) => v.address === pool.tokenB);
  const balanceB = Number(rawBalanceB) / 10 ** (tokenInfoB?.decimals || 18);
  const tokenB = { ...tokenInfoB, balance: balanceB };

  console.log({ tokenA, tokenB });
};

declare module KLAYswap {
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
    airdropRewardRate: [];
    feeRewardRate: string;
  }

  export interface RecentPoolInfo {
    common: Common;
    recentPool: any[][];
    categories: Category[];
  }
}
