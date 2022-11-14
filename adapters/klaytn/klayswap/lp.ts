import { safeAsyncFlatMap } from '@bento/common';
import BigNumber from 'bn.js';

import {
  ProtocolAccountInfo,
  ProtocolGetAccount,
  ProtocolInfo,
  TokenInput,
} from '@/_lib/types';

import { klaytnChain, multicall } from '../_lib/chain';
import { getTokenInfo } from '../_lib/getTokenInfo';
import IKSLP from './_abis/IKSLP.json';
import KLAYSWAP_LP_POOLS from './_data/klayswap-lp-pools.json';

export const getLPPoolBalance = async (
  _account: string,
  lpTokenBalance: number,
  pool: KLAYswap.Pool,
): Promise<ProtocolAccountInfo> => {
  const kslp = new klaytnChain._provider.klay.Contract(
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

  let tokens: (TokenInput | null)[] = [];
  if (tokenInfoA) {
    tokens.push({ ...tokenInfoA, ind: tokenInfoA.address });
  } else {
    tokens.push(null);
  }
  if (tokenInfoB) {
    tokens.push({ ...tokenInfoB, ind: tokenInfoB.address });
  } else {
    tokens.push(null);
  }

  return {
    prefix: tokens.flatMap((v) => v?.symbol || []).join(' + '),
    ind: pool.exchange_address.toLowerCase(),
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

const isSameAddress = (a: string, b: string): boolean => {
  try {
    return a.toLowerCase() === b.toLowerCase();
  } catch (err) {
    console.error(err, { a, b });
    return false;
  }
};

const info: ProtocolInfo = {
  native: false,
  ind: null,
  name: {
    en: 'Pair Deposit',
    ko: '페어 예치',
  },
  conditional: {
    passAllBalances: true,
  },
};
export default info;
export const getAccount: ProtocolGetAccount = async (
  account,
  _,
  allRawTokenBalances,
) => {
  try {
    const pools = KLAYSWAP_LP_POOLS;

    const items = await safeAsyncFlatMap(
      Object.entries(allRawTokenBalances || {}),
      async ([tokenAddress, tokenRawBalance]) => {
        const klayswapLPPool = pools.find((v) =>
          isSameAddress(v.exchange_address, tokenAddress),
        );
        if (!!klayswapLPPool) {
          const item = getLPPoolBalance(
            account,
            tokenRawBalance,
            klayswapLPPool,
          );
          if (!item) {
            return [];
          }
          return item;
        }
        return [];
      },
    );

    return items;
  } catch (err) {
    throw err;
  }
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
