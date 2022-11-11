import { safePromiseAll } from '@bento/common';
import { OSMOSIS_TOKENS, pricesFromCoinGecko, withCache } from '@bento/core';
import groupBy from 'lodash.groupby';
// import Long from 'long';
import { osmosis } from 'osmojs';

import {
  ProtocolAccountInfo,
  ProtocolGetAccount,
  ProtocolInfo,
  TokenInput,
} from '@/_lib/types';

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

const omit = <Obj extends object, OmittedKey extends string>(
  obj: Obj,
  key: OmittedKey,
): Omit<Obj, OmittedKey> => {
  const { [key]: _omitted, ...rest } = obj;
  return rest;
};

const fallbackLockupQuery = (error: Error) => {
  console.error(error);
  return {
    coins: [],
  };
};

const getDenomsFromPool = (pool: Pool) =>
  pool.pool_assets.map((poolAsset) => poolAsset.token.denom);

const info: ProtocolInfo = {
  native: true,
  ind: null,
  name: {
    en: 'Osmosis LPs',
    ko: '오스모시스 LP 풀',
  },
};
export default info;

export const getAccount: ProtocolGetAccount = async (account: string) => {
  const client = await osmosis.ClientFactory.createLCDClient({
    restEndpoint: 'https://lcd-osmosis.blockapsis.com',
  }).catch((err) => {
    throw err;
  });

  let pricesByDenom: Record<string, number> = {};

  const getPrice = withCache(async (poolId: string, poolDenoms: string[]) => {
    try {
      let baseAssetDenom: string | null = null;
      let basePrice: number | null = null;

      for (const denom of poolDenoms) {
        if (denom in pricesByDenom) {
          baseAssetDenom = denom;
          basePrice = pricesByDenom[denom];
          break;
        }
      }

      const prices: Record<string, number | null> = {};
      for (const denom of poolDenoms) {
        if (denom in pricesByDenom) {
          prices[denom] = pricesByDenom[denom];
        } else if (!!baseAssetDenom) {
          const spotPriceRaw = await client.osmosis.gamm.v1beta1
            .spotPrice({
              poolId: poolId as any,
              baseAssetDenom: baseAssetDenom,
              quoteAssetDenom: denom,
            })
            .catch((err) => {
              console.error(err);
              return { spot_price: '0' };
            });
          const spotPrice = parseFloat(spotPriceRaw.spot_price);
          prices[denom] = (basePrice || 0) / spotPrice;
          pricesByDenom[denom] = (basePrice || 0) / spotPrice;
        } else {
          prices[denom] = null;
        }
      }
      return prices;
    } catch (err) {
      console.error(err);
      return {};
    }
  });

  try {
    const client = await osmosis.ClientFactory.createLCDClient({
      restEndpoint: 'https://lcd-osmosis.blockapsis.com',
    });

    const types = ['locked', 'unlockable', 'unlocking'];
    type PoolBalanceType = {
      status: 'available' | 'locked' | 'unlockable' | 'unlocking';
      poolId: string;
      denom: string;
      amount: string;
    };

    const fetchLockupBalances = () =>
      Promise.all([
        client.osmosis.lockup
          .accountLockedCoins({ owner: account })
          .catch(fallbackLockupQuery),
        client.osmosis.lockup
          .accountUnlockableCoins({ owner: account })
          .catch(fallbackLockupQuery),
        client.osmosis.lockup
          .accountUnlockingCoins({ owner: account })
          .catch(fallbackLockupQuery),
      ]);

    const walletBalancesResponse = await client.cosmos.bank.v1beta1.allBalances(
      {
        address: account,
      },
    );
    const lockupBalances = await fetchLockupBalances();

    let poolBalances = lockupBalances.flatMap((v, index) =>
      v.coins.map(
        (coin) =>
          ({
            ...coin,
            poolId: coin.denom.replace('gamm/pool/', ''),
            status: types[index],
          } as PoolBalanceType),
      ),
    );

    for (const token of walletBalancesResponse.balances) {
      if (token.denom.startsWith('gamm/pool/')) {
        poolBalances.push({
          denom: token.denom,
          amount: token.amount,
          poolId: token.denom.replace('gamm/pool/', ''),
          status: 'available',
        });
      }
    }

    const getPool = (poolId: string) =>
      client.osmosis.gamm.v1beta1.pool({
        // poolId: Long.fromString(poolId),
        poolId: poolId as any,
      }) as unknown as Promise<{ pool: Pool }>;

    let tokenInfoByDenom: Record<string, TokenInput> = {};
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
        const denoms = getDenomsFromPool(poolInfo);
        denoms.map((d) => {
          const tokenInfo = OSMOSIS_TOKENS.find(
            (v) => v.denomUnits?.findIndex((u) => u.denom === d) !== -1,
          );
          const allDenoms = tokenInfo?.denomUnits?.map((v) => v.denom) || [];
          for (const denom of allDenoms) {
            if (!(denom in tokenInfoByDenom) && !!tokenInfo) {
              // FIXME:
              // tokenInfoByDenom[denom] = tokenInfo;
              tokenInfoByDenom[denom] = {
                ...tokenInfo,
                ind: tokenInfo.address,
              };
            }
            if (!!tokenInfo?.coinGeckoId && !(denom in coinGeckoIdByDenom)) {
              coinGeckoIdByDenom[denom] = tokenInfo.coinGeckoId;
            }
          }
        });
      }),
    );

    let coinGeckoIds = [...new Set(Object.values(coinGeckoIdByDenom))];
    pricesByDenom = !!coinGeckoIds.length
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

    const poolBalancesWithPrices = await safePromiseAll(
      poolBalances.map(async (poolBalance) => {
        const poolId = poolBalance.poolId;
        const pool = poolInfoByPoolId[poolId];
        const prices = await getPrice(poolId, getDenomsFromPool(pool));
        return { prices, ...poolBalance };
      }),
    );
    const stakings: ProtocolAccountInfo[] = [];
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
        const denoms = getDenomsFromPool(poolInfo);

        const tokenInfos: Record<string, TokenInput> = {};
        const tokenLiquidities: Record<string, number> = {};
        const assetPrices: Record<string, number> = {};
        for (const denom of denoms) {
          const tokenInfo = tokenInfoByDenom[denom];
          const assetPrice = _poolBalancesWithPrices[0].prices?.[denom] || 0;
          tokenInfos[denom] = tokenInfo;
          assetPrices[denom] = assetPrice;
          tokenLiquidities[denom] = Number(
            poolInfo.pool_assets.find((v) => v.token.denom === denom)?.token
              .amount || 0,
          );
        }

        const [walletAmount, stakedAmount, claimableAmount, pendingAmount] =
          _poolBalancesWithPrices.reduce(
            (acc, v) => {
              const [wallet, staked, claimable, pending] = acc;
              if (v.status === 'locked') {
                return [wallet, staked + Number(v.amount), claimable, pending];
              } else if (v.status === 'unlockable') {
                return [wallet, staked, claimable + Number(v.amount), pending];
              } else if (v.status === 'unlocking') {
                return [wallet, staked, claimable, pending + Number(v.amount)];
              } else if (v.status === 'available') {
                return [wallet + Number(v.amount), staked, claimable, pending];
              }
              return acc;
            },
            [0, 0, 0, 0],
          );

        const totalLiquidity = Number(poolInfo.total_shares.amount);

        const fromAmount = (amount: number) => {
          try {
            const poolStakeRatio = amount / totalLiquidity;

            const tokenAmounts: Record<string, number> = {};
            const value = denoms.reduce((acc, denom) => {
              const tokenInfo = tokenInfos[denom];
              const tokenLiquidity = tokenLiquidities[denom];
              const tokenAmount =
                (tokenLiquidity * poolStakeRatio) / 10 ** tokenInfo.decimals;

              tokenAmounts[tokenInfo.ind] = tokenAmount;
              return acc + tokenAmount * assetPrices[denom];
            }, 0);

            return {
              // NOTE: LP decimals are hardcoded to 18
              lpAmount: amount / 10 ** 18,
              tokenAmounts,
              value,
            };
          } catch (err) {
            console.error(err);
            // return 'unavailable';
            return {
              lpAmount: 0,
              tokenAmounts: {},
              value: 0,
            };
          }
        };

        const tokens = denoms.flatMap((denom) => {
          const tokenInfo = tokenInfos[denom];
          if (!tokenInfo) {
            console.warn(`Denom not found: ${denom}`);
            return [];
          }
          return omit<TokenInput, 'denomUnits'>(tokenInfo, 'denomUnits');
        });

        // NOTE: Subtract unbonding amount from staked amount (to prevent double-counting)
        let stakedValue = fromAmount(stakedAmount);
        let pendingValue = fromAmount(pendingAmount);
        stakedValue.value -= pendingValue.value;
        stakedValue.lpAmount -= pendingValue.lpAmount;
        stakedValue.tokenAmounts = Object.entries(
          stakedValue.tokenAmounts,
        ).reduce((acc, [k, v]) => {
          acc[k] = v - pendingValue.tokenAmounts[k];
          return acc;
        }, {} as Record<string, number>);

        stakings.push({
          ind: poolId,
          prefix: tokens.flatMap((v) => v?.symbol || []).join(' + '),
          tokens: tokens,
          wallet: fromAmount(walletAmount),
          staked: stakedValue,
          rewards: null,
          unstake: {
            claimable: fromAmount(claimableAmount),
            pending: pendingValue,
          },
        });
      },
    );

    return stakings;
  } catch (err) {
    throw err;
  }
};
