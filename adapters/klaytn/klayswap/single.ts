import { safeAsyncFlatMap } from '@bento/common';
import axios from 'axios';
import BigNumber from 'bn.js';

import {
  ProtocolAccountInfo,
  ProtocolGetAccount,
  ProtocolInfo,
} from '@/_lib/types';

import { klaytnChain } from '../_lib/chain';
import { getTokenInfo } from '../_lib/getTokenInfo';
import KLAYSwapSingleLeveragePool from './_abis/KLAYSwapSingleLeveragePool.json';
import { KSP_TOKEN_INFO } from './_constants';
import KLAYSWAP_LEVERAGE_POOLS from './_data/klayswap-leverage-pools.json';

const provider = klaytnChain._provider;

const isSameAddress = (a: string, b: string): boolean => {
  try {
    return a.toLowerCase() === b.toLowerCase();
  } catch (err) {
    console.error(err, { a, b });
    return false;
  }
};

// TODO: Someday
// export const getEcopotPoolList = async () => {
//   const { data } = await axios.get<KLAYswap.PoolVotingDataResponse>(
//     'https://s.klayswap.com/stat/poolVotingData.json',
//   );
//   return data.ecopots;
// };

export const getLeveragePoolList = async () => {
  const { data } = await axios.get<any>(
    'https://s.klayswap.com/stat/leverage.min.json',
  );
  const singlePools: any[] = data.leveragePool.single;
  const fields = singlePools[0] as string[];
  const pools = singlePools.slice(1).map((pool: any[]) => {
    const poolObj: any = {};
    pool.forEach((value, index) => {
      poolObj[fields[index]] = value;
    });
    return poolObj as SingleLeveragePool;
  });
  return pools;
};

export const getSinglePoolBalance = async (
  account: string,
  tokenBalance: number,
  pool: SingleLeveragePool,
  _dynamicPool: SingleLeveragePool | undefined,
): Promise<ProtocolAccountInfo> => {
  const dynamicPool = _dynamicPool || pool;
  const iToken = new provider.klay.Contract(
    KLAYSwapSingleLeveragePool as any[],
    pool.address,
  );

  // const tokenTotalSupply = await iToken.methods.totalSupply().call();
  const tokenTotalSupply = dynamicPool.totalSupply;
  // const totalDeposit = ... // TODO: how do we get `totalDeposit`?
  const totalDeposit = dynamicPool.totalDeposit;

  const rawBalance = new BigNumber.BN(tokenBalance)
    .mul(new BigNumber.BN(totalDeposit))
    .div(new BigNumber.BN(tokenTotalSupply));
  const rawRewards: string = await iToken.methods.userRewardSum(account).call();

  // NOTE: Rewarding token is KSP
  const rewards = Number(rawRewards) / 10 ** KSP_TOKEN_INFO.decimals;

  const tokenInfo = getTokenInfo(pool.token);
  const balance = Number(rawBalance) / 10 ** (tokenInfo?.decimals || 18);
  let tokenAmounts: Record<string, number | undefined> | undefined = undefined;
  if (tokenInfo) {
    tokenAmounts = {
      [tokenInfo.address]: balance,
    };
  }

  return {
    prefix: tokenInfo?.symbol,
    ind: pool.address,
    wallet: null,
    tokens: [!tokenInfo ? null : { ...tokenInfo, ind: tokenInfo.address }],
    relatedTokens: [{ ...KSP_TOKEN_INFO, ind: KSP_TOKEN_INFO.address }],
    staked: {
      tokenAmounts,
    },
    rewards: {
      tokenAmounts: {
        [KSP_TOKEN_INFO.address]: rewards,
      },
    },
    unstake: null,
  };
};

const info: ProtocolInfo = {
  native: false,
  ind: null,
  name: {
    en: 'Single-side Deposit',
    ko: '단일 예치',
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
    const dynamicLeveragePools = await getLeveragePoolList();

    const items = await safeAsyncFlatMap(
      Object.entries(allRawTokenBalances || {}),
      async ([tokenAddress, tokenRawBalance]) => {
        const klayswapLeveragePool = KLAYSWAP_LEVERAGE_POOLS.find((v) =>
          isSameAddress(v.address, tokenAddress),
        );
        if (!!klayswapLeveragePool) {
          const item = getSinglePoolBalance(
            account,
            tokenRawBalance,
            klayswapLeveragePool,
            dynamicLeveragePools?.find(
              (v) => v.address === klayswapLeveragePool.address,
            ),
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

export interface SingleLeveragePool {
  id: number;
  address: string;
  token: string;
  amount: string;
  totalDeposit: string;
  totalDepositVol: string;
  totalSupply: string;
  miningRate: string;
  dailyMining: string;
  miningIndex: string;
  borrowIndex: string;
  lastMined: string;
  totalBorrow: string;
  totalReserve: string;
  totalReserveVol: string;
  burnKSP: string;
  burnKSPVol: string;
  isDeposit: boolean;
  isWithdraw: boolean;
  reserveFactor: string;
  kspRewardRate: string;
  supplyRate: string;
  totalRewardRate: string;
  undefined: null;
}
