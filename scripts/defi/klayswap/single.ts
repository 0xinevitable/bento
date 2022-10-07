import { KlaytnChain } from '@bento/core/lib/chains';
import { KLAYTN_TOKENS, TokenInput } from '@bento/core/lib/tokens';
import axios from 'axios';
import BigNumber from 'bn.js';

import KLAYSwapSingleLeveragePool from '../abis/KLAYSwapSingleLeveragePool.json';

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

type Token = Partial<TokenInput> & {
  balance: number;
};
export const getSinglePoolBalance = async (
  pool: KLAYswap.SingleLeveragePool,
  account: string,
): Promise<Token> => {
  const iToken = new provider.klay.Contract(
    KLAYSwapSingleLeveragePool as any[],
    pool.address,
  );

  const tokenBalance = await iToken.methods.balanceOf(account).call();
  // const tokenTotalSupply = await iToken.methods.totalSupply().call();
  const tokenTotalSupply = pool.totalSupply;
  // const totalDeposit = ... // TODO: how do we get `totalDeposit`?
  const totalDeposit = pool.totalDeposit;

  let rawBalanceA = new BigNumber.BN(tokenBalance)
    .mul(new BigNumber.BN(totalDeposit))
    .div(new BigNumber.BN(tokenTotalSupply));

  const rewards = await iToken.methods.userRewardSum(account).call();

  const tokenInfo =
    pool.token === ZERO_ADDRESS
      ? klaytnChain.currency
      : KLAYTN_TOKENS.find((v) => v.address === pool.token);
  const balance = Number(rawBalanceA) / 10 ** (tokenInfo?.decimals || 18);
  const token = { ...tokenInfo, balance: balance };
  return token;
};

declare module KLAYswap {
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
