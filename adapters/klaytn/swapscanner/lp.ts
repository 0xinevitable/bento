import { withCache } from '@bento/core';

import { klaytnChain } from '../_lib/chain';
import { MINIMAL_ABIS, SCNR_KLAY_LP_ADDRESS } from './_constants';

const provider = klaytnChain._provider;

const _getStakedSCNRReserves = async () => {
  const lp = new provider.klay.Contract(MINIMAL_ABIS.LP, SCNR_KLAY_LP_ADDRESS);
  const { 0: reservesForSCNR, 1: reservesForKLAY } = await lp.methods
    .getReserves()
    .call();
  return { reservesForSCNR, reservesForKLAY };
};

export const getSCNRTokenPrice = withCache(async () => {
  const [staked, klayPrice] = await Promise.all([
    _getStakedSCNRReserves(),
    klaytnChain.getCurrencyPrice(),
  ]);

  const { reservesForSCNR, reservesForKLAY } = staked;
  const amountOfSCNRStaked = reservesForSCNR / 10 ** 25;
  const amountOfKLAYStaked =
    reservesForKLAY / 10 ** klaytnChain.currency.decimals;

  const exchangeRatio = amountOfKLAYStaked / amountOfSCNRStaked;
  return exchangeRatio * klayPrice;
});

// TODO: Someday
// export const getLPPoolBalance = async (
//   account: string,
// ): Promise<DeFiStaking> => {};
