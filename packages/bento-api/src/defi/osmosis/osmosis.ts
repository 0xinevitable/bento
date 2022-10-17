import { safePromiseAll } from '@bento/common';
import { OSMOSIS_TOKENS, pricesFromCoinGecko, withCache } from '@bento/core';
import { osmosis } from 'osmojs';

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

const getPool = (client: any, poolId: string) =>
  client.osmosis.gamm.v1beta1.pool({
    poolId: poolId as any,
  }) as unknown as Promise<{ pool: Pool }>;

export const getGAMMLPs = async (walletAddress: string) => {
  const client = await osmosis.ClientFactory.createRPCQueryClient({
    rpcEndpoint: 'https://rpc-osmosis.blockapsis.com',
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

  let tokenInfoByDenom: Record<string, any> = {};
  let coinGeckoIdByDenom: Record<string, string> = {};
  let poolInfoByPoolId: Record<string, Pool> = {};
  await safePromiseAll(
    poolBalances.map(async (poolBalance) => {
      let poolInfo: Pool;
      if (!poolInfoByPoolId[poolBalance.poolId]) {
        const poolRes = await getPool(client, poolBalance.poolId);
        poolInfoByPoolId[poolBalance.poolId] = poolRes.pool;
        poolInfo = poolRes.pool;
      } else {
        poolInfo = poolInfoByPoolId[poolBalance.poolId];
      }
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
        const spotPriceA = parseFloat(spotPrice.spotPrice);
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

  const pools = await safePromiseAll(
    poolBalances.map(async (poolBalance) => {
      const pool = poolInfoByPoolId[poolBalance.poolId];
      const prices = await getPrice(
        poolBalance.poolId,
        getDenomsFromPool(pool),
      );
      return { poolBalance, prices };
    }),
  );
  // console.log(JSON.stringify({ pools }, null, 2));
};
