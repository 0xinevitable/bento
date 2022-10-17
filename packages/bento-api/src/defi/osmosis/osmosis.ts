import { safePromiseAll } from '@bento/common';
import { OSMOSIS_TOKENS, pricesFromCoinGecko, withCache } from '@bento/core';
import groupBy from 'lodash.groupby';
// import Long from 'long';
import { osmosis } from 'osmojs';

import {
  DeFiStaking,
  OsmosisDeFiProtocolType,
  OsmosisDeFiType,
} from '../types/staking';

export interface Coin {
  denom: string;
  amount: string;
}
export interface Pool {
  '@type': string;
  address: string;
  id: string;
  pool_params: {
    lock: boolean;
    swap_fee: string;
    exitFee: string;
    smooth_weight_change_params: {
      start_time: string;
      duration: string;
      initial_pool_weights: {
        token: Coin;
        weight: string;
      }[];
      target_pool_weights: {
        token: Coin;
        weight: string;
      }[];
    } | null;
  };
  future_pool_governor: string;
  total_weight: string;
  total_shares: Coin;
  pool_assets: {
    weight: string;
    token: Coin;
  }[];
}

const getDenomsFromPool = (pool: Pool) =>
  pool.pool_assets.map((poolAsset) => poolAsset.token.denom);

export const getGAMMLPs = async (
  walletAddress: string,
): Promise<DeFiStaking[]> => {
  const client = await osmosis.ClientFactory.createLCDClient({
    restEndpoint: 'https://lcd-osmosis.blockapsis.com',
  });

  const types = ['locked', 'unlockable', 'unlocking'];
  type PoolBalanceType = {
    status: 'locked' | 'unlockable' | 'unlocking';
    poolId: string;
    denom: string;
    amount: string;
  };
  const poolBalances = (
    await safePromiseAll([
      client.osmosis.lockup
        .accountLockedCoins({ owner: walletAddress })
        .catch(() => ({ coins: [] })),
      client.osmosis.lockup
        .accountUnlockableCoins({ owner: walletAddress })
        .catch(() => ({ coins: [] })),
      client.osmosis.lockup
        .accountUnlockingCoins({ owner: walletAddress })
        .catch(() => ({ coins: [] })),
    ])
  ).flatMap((v, index) =>
    v.coins.map(
      (coin) =>
        ({
          ...coin,
          poolId: coin.denom.replace('gamm/pool/', ''),
          status: types[index],
        } as PoolBalanceType),
    ),
  );

  // console.log({ poolBalances });

  const getPool = (poolId: string) =>
    client.osmosis.gamm.v1beta1.pool({
      // poolId: Long.fromString(poolId),
      poolId: poolId as any,
    }) as unknown as Promise<{ pool: Pool }>;

  let tokenInfoByDenom: Record<string, any> = {};
  let coinGeckoIdByDenom: Record<string, string> = {};
  let poolInfoByPoolId: Record<string, Pool> = {};
  await Promise.all(
    poolBalances.map(async (poolBalance) => {
      let poolInfo: Pool;
      if (poolBalance.poolId in poolInfoByPoolId) {
        poolInfo = poolInfoByPoolId[poolBalance.poolId];
      } else {
        const poolRes = await getPool(poolBalance.poolId).catch((err) => {
          throw err;
        });
        poolInfoByPoolId[poolBalance.poolId] = poolRes.pool;
        poolInfo = poolRes.pool;
      }

      console.log(poolBalance, JSON.stringify(poolInfo, null, 2));
      const denoms = getDenomsFromPool(poolInfo);
      denoms.map((d) => {
        const tokenInfo = OSMOSIS_TOKENS.find(
          (v) => v.denomUnits?.findIndex((u) => u.denom === d) !== -1,
        );
        const allDenoms = tokenInfo?.denomUnits?.map((v) => v.denom) || [];
        for (const denom of allDenoms) {
          if (!(denom in tokenInfoByDenom)) {
            tokenInfoByDenom[denom] = tokenInfo;
          }
          if (!!tokenInfo?.coinGeckoId && !(denom in coinGeckoIdByDenom)) {
            coinGeckoIdByDenom[denom] = tokenInfo.coinGeckoId;
          }
        }
      });
    }),
  );

  let coinGeckoIds = [...new Set(Object.values(coinGeckoIdByDenom))];
  const pricesByDenom: Record<string, number> = !!coinGeckoIds.length
    ? await pricesFromCoinGecko(coinGeckoIds)
        .then((data) => {
          const result: Record<string, number> = {};
          for (const denom in coinGeckoIdByDenom) {
            const id = coinGeckoIdByDenom[denom];
            result[denom] = data[id];
          }
          return result;
        })
        .catch((err) => {
          console.error(err);
          return {};
        })
    : {};

  const getPrice = withCache(async (poolId: string, poolDenoms: string[]) => {
    try {
      const [assetDenomA, assetDenomB] = poolDenoms;
      let assetPriceA: number | null = null;
      if (assetDenomA in pricesByDenom) {
        assetPriceA = pricesByDenom[assetDenomA];
      }
      let assetPriceB: number | null = null;
      if (assetDenomB in pricesByDenom) {
        assetPriceB = pricesByDenom[assetDenomB];
      }

      if (assetPriceA === null && assetPriceB === null) {
        return [null, null];
      }

      if (assetPriceA === null || assetPriceB === null) {
        const spotPrice = await client.osmosis.gamm.v1beta1.spotPrice({
          poolId: poolId as any,
          baseAssetDenom: assetDenomA,
          quoteAssetDenom: assetDenomB,
        });
        const spotPriceA = parseFloat(spotPrice.spot_price);
        const spotPriceB = 1 / spotPriceA;
        if (assetPriceA === null) {
          assetPriceA = spotPriceA;
        }
        if (assetPriceB === null) {
          assetPriceB = spotPriceB;
        }
      }
      return [assetPriceA, assetPriceB];
    } catch (err) {
      console.error(err);
      return [null, null];
    }
  });

  const poolBalancesWithPrices = await safePromiseAll(
    poolBalances.map(async (poolBalance) => {
      const poolId = poolBalance.poolId;
      const pool = poolInfoByPoolId[poolId];
      console.log(pool);
      const prices = await getPrice(poolId, getDenomsFromPool(pool));
      return { prices, ...poolBalance };
    }),
  );
  console.log(JSON.stringify({ poolBalancesWithPrices }, null, 2));

  const stakings: DeFiStaking[] = [];

  console.log(poolInfoByPoolId);
  const poolBalancesWithPricesByPoolID = groupBy(
    poolBalancesWithPrices,
    'poolId',
  );
  Object.entries(poolBalancesWithPricesByPoolID).map(
    ([poolId, _poolBalancesWithPrices]) => {
      if (!_poolBalancesWithPrices || _poolBalancesWithPrices.length === 0) {
        return;
      }
      const poolInfo = poolInfoByPoolId[poolId];
      console.log({ poolInfo });

      const denoms = getDenomsFromPool(poolInfo);
      const [assetDenomA, assetDenomB] = denoms;
      const tokenInfoA = tokenInfoByDenom[assetDenomA];
      const tokenInfoB = tokenInfoByDenom[assetDenomB];
      const assetPriceA = _poolBalancesWithPrices[0].prices[0] || 0;
      const assetPriceB = _poolBalancesWithPrices[0].prices[1] || 0;

      const [stakedAmount, claimableAmount, pendingAmount] =
        _poolBalancesWithPrices.reduce(
          (acc, v) => {
            const [staked, claimable, pending] = acc;
            if (v.status === 'locked') {
              return [staked + Number(v.amount), claimable, pending];
            } else if (v.status === 'unlockable') {
              return [staked, claimable + Number(v.amount), pending];
            } else if (v.status === 'unlocking') {
              return [staked, claimable, pending + Number(v.amount)];
            }
            return acc;
          },
          [0, 0, 0],
        );

      const tokenALiquidity = Number(
        poolInfo.pool_assets.find((v) => v.token.denom === assetDenomA)?.token
          .amount || 0,
      );
      const tokenBLiquidity = Number(
        poolInfo.pool_assets.find((v) => v.token.denom === assetDenomB)?.token
          .amount || 0,
      );

      const totalLiquidity = Number(poolInfo.total_shares.amount);

      const fromAmount = (amount: number) => {
        const poolStakeRatio = amount / totalLiquidity;
        const tokenAAmount = tokenALiquidity * poolStakeRatio;
        const tokenBAmount = tokenBLiquidity * poolStakeRatio;
        return {
          lpAmount: amount,
          tokenAmounts: {
            [tokenInfoA.address]: tokenAAmount,
            [tokenInfoB.address]: tokenBAmount,
          },
          value: tokenAAmount * assetPriceA + tokenBAmount * assetPriceB,
        };
      };

      stakings.push({
        protocol: OsmosisDeFiProtocolType.OSMOSIS,
        type: OsmosisDeFiType.OSMOSIS_GAMM_LP,
        address: OsmosisDeFiType.OSMOSIS_GAMM_LP,
        tokens: [tokenInfoA, tokenInfoB],
        wallet: 'unavailable',
        staked: fromAmount(stakedAmount),
        rewards: 'unavailable',
        unstake: {
          claimable: fromAmount(claimableAmount),
          pending: fromAmount(pendingAmount),
        },
      });
    },
  );

  return stakings;
};
