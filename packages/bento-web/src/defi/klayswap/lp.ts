import { KlaytnChain } from '@bento/core/lib/chains';
import { KLAYTN_TOKENS, TokenInput } from '@bento/core/lib/tokens';
// import axios from 'axios';
import BigNumber from 'bn.js';

import IERC20 from '../abis/IERC20.json';
import IKSLP from '../abis/IKSLP.json';

const klaytnChain = new KlaytnChain();
const provider = klaytnChain._provider;

// const DENYLIST: string[] = [];

// export const getLPPoolList = async () => {
//   const { data } = await axios.get<KLAYswap.RecentPoolInfo>(
//     'https://s.klayswap.com/stat/recentPoolInfo.min.json',
//   );

//   const fields = data.recentPool[0] as string[];
//   const pools = data.recentPool.slice(1).flatMap((pool) => {
//     let poolObj: any = {};
//     fields.forEach((field, index) => {
//       poolObj[field] = pool[index];
//     });

//     if (DENYLIST.includes(poolObj.exchange_address)) {
//       return [];
//     }
//     return poolObj as KLAYswap.Pool;
//   });

//   return pools;
// };

type Token = Partial<TokenInput> & {
  balance: number;
};
export const getLPPoolBalance = async (
  account: string,
  pool: KLAYswap.Pool,
): Promise<Token[]> => {
  const kslp = new provider.klay.Contract(
    [...IKSLP, ...IERC20] as any[],
    pool.exchange_address,
  );

  const liquidity = await kslp.methods.balanceOf(account).call();
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
  const tokenA = { ...tokenInfoA, balance: balanceA };
  const tokenInfoB = KLAYTN_TOKENS.find((v) => v.address === pool.tokenB);
  const balanceB = Number(rawBalanceB) / 10 ** (tokenInfoB?.decimals || 18);
  const tokenB = { ...tokenInfoB, balance: balanceB };

  return [tokenA, tokenB];
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
