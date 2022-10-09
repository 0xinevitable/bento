import { KlaytnChain } from '@bento/core/lib/chains';
import { KLAYTN_TOKENS, TokenInput } from '@bento/core/lib/tokens';
import axios from 'axios';
import BigNumber from 'bn.js';

import KLAYSwapSingleLeveragePool from '../abis/KLAYSwapSingleLeveragePool.json';
import { DeFiStaking, KlaytnDeFiType } from '../types/staking';
import { KSP_TOKEN_INFO } from './constants';

const klaytnChain = new KlaytnChain();
const provider = klaytnChain._provider;

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

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
    return poolObj as KLAYswap.SingleLeveragePool;
  });
  return pools;
};

export const getSinglePoolBalance = async (
  account: string,
  tokenBalance: string,
  pool: KLAYswap.SingleLeveragePool,
  _dynamicPool: KLAYswap.SingleLeveragePool | undefined,
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

export declare module KLAYswap {
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

  //   export interface PoolInfo {}
  //   export interface IsValidPool {
  //     prev: boolean;
  //     next: boolean;
  //   }
  //   export interface Prev {
  //     power: string;
  //   }
  //   export interface Rate {
  //     prev: string;
  //     next: string;
  //   }
  //   export interface Boosting {
  //     prev: Prev;
  //     rate: Rate;
  //   }
  //   export interface Daily {
  //     prev: string;
  //   }
  //   export interface Weekly {
  //     prev: string;
  //   }
  //   export interface Monthly {
  //     prev: string;
  //   }
  //   export interface Rate2 {
  //     prev: string;
  //     next: string;
  //   }
  //   export interface Buyback {
  //     daily: Daily;
  //     weekly: Weekly;
  //     monthly: Monthly;
  //     rate: Rate2;
  //   }
  //   export interface VotingPool {
  //     exchange: string;
  //     voted: string;
  //     lastVoted: string;
  //     curRate: string;
  //     nextRate: string;
  //     votingShareRate: string;
  //     lastVotingShareRate: string;
  //     votingReward: string;
  //     nextVotingReward: string;
  //     poolInfo: PoolInfo;
  //     isValidPool: IsValidPool;
  //     boosting: Boosting;
  //     buyback: Buyback;
  //   }
  //   export interface TotalVotedKsp {
  //     prev: string;
  //     next: string;
  //     prevActive: string;
  //     nextActive: string;
  //     prevInactive: string;
  //     nextInactive: string;
  //   }
  //   export interface TotalBoosting {
  //     all: string;
  //     daily: string;
  //     weekly: string;
  //     monthly: string;
  //   }
  //   export interface Token {
  //     id: number;
  //     address: string;
  //     symbol: string;
  //     name: string;
  //     chain: string;
  //     img: string;
  //     decimal: number;
  //     amount: string;
  //     volume: string;
  //     buyback: number;
  //     verified: number;
  //     type: number;
  //     stable: number;
  //     poolVotingValid: number;
  //     poolVotingBoosting: number;
  //     price: string;
  //   }
  //   export interface Ecopot {
  //     id: number;
  //     address: string;
  //     tokenAddr: string;
  //     amountPerBlock: string;
  //     distributableBlock: string;
  //     distributionIndex: string;
  //     endBlock: string;
  //     vKSP: string;
  //     totalAmount: string;
  //     teamImg: string;
  //     tokenImg: string;
  //     projectName: string;
  //     site: string;
  //     valid: number;
  //     createdAt: Date;
  //     maxRate: string;
  //     token: Token;
  //   }
  //   export interface Rates {
  //     staking: string;
  //     drops: string;
  //     poolVotingAddr: string;
  //     poolVoting: string;
  //     ecopot: string;
  //   }
  //   export interface StakingRewards {
  //     kspRewardSum: string;
  //     ecopotRewardSum: string;
  //     dropRewardSum: string;
  //     feeRewardSum: string;
  //   }
  //   export interface PoolVotingDataResponse {
  //     votingPools: VotingPool[];
  //     totalVotedKsp: TotalVotedKsp;
  //     totalBoosting: TotalBoosting;
  //     ecopots: Ecopot[];
  //     rates: Rates;
  //     stakingRewards: StakingRewards;
  //   }
}
