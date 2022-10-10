import { ZERO_ADDRESS } from '@bento/core';
import { KLAYTN_TOKENS } from '@bento/core/lib/tokens';
import BigNumber from 'bn.js';

import { axios } from '@/utils';

import KLAYSwapSingleLeveragePool from '../abis/KLAYSwapSingleLeveragePool.json';
import { klaytnChain } from '../constants';
import { DeFiStaking, KlaytnDeFiType } from '../types/staking';
import { KSP_TOKEN_INFO } from './constants';

const provider = klaytnChain._provider;

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
  tokenBalance: string,
  pool: SingleLeveragePool,
  _dynamicPool: SingleLeveragePool | undefined,
): Promise<DeFiStaking> => {
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

  const tokenInfo =
    pool.token === ZERO_ADDRESS
      ? klaytnChain.currency
      : KLAYTN_TOKENS.find((v) => v.address === pool.token);
  const balance = Number(rawBalance) / 10 ** (tokenInfo?.decimals || 18);

  return {
    type: KlaytnDeFiType.KLAYSWAP_LEVERAGE_SINGLE,
    address: pool.address,
    wallet: null,
    tokens: [tokenInfo || null],
    staked: {
      lpAmount: balance,
    },
    rewards: {
      tokenAmounts: {
        [KSP_TOKEN_INFO.address]: rewards,
      },
    },
    unstake: null,
  };
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
