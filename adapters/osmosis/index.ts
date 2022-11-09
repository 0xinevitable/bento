import {
  Currency,
  OSMOSIS_TOKENS,
  priceFromCoinGecko,
  withCache,
} from '@bento/core';
import axios, { Axios } from 'axios';

import { ChainGetAccount, ChainInfo } from '@/_lib/types';
import {
  CosmosSDKBasedBalanceResponse,
  CosmosSDKBasedChain,
  CosmosSDKBasedDelegationRewardsResponse,
  CosmosSDKBasedDelegationsResponse,
} from '@/_lib/types/cosmos-sdk';

export class OsmosisChain implements CosmosSDKBasedChain {
  currency = {
    symbol: 'OSMO',
    name: 'Osmosis',
    logo: '/assets/icons/osmosis.png',
    decimals: 6,
    coinGeckoId: 'osmosis',
    coinMinimalDenom: 'uosmo',
    ind: 'uosmo',
  };
  bech32Config = {
    prefix: 'osmo',
  };
  _provider: Axios = axios.create({
    baseURL: 'https://osmosis.stakesystems.io',
    timeout: 4_000,
  });
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);

  _getBalances = withCache(async (address: string) =>
    this._provider.get<CosmosSDKBasedBalanceResponse>(
      `/cosmos/bank/v1beta1/balances/${address}`,
    ),
  );
  getBalance = async (address: string) => {
    const { data } = await this._getBalances(address);
    const coinBalance =
      data.balances.find((v) => v.denom === this.currency.coinMinimalDenom)
        ?.amount ?? 0;
    const balance = Number(coinBalance) / 10 ** this.currency.decimals;
    return balance;
  };
  getDelegations = async (address: string) => {
    const { data } =
      await this._provider.get<CosmosSDKBasedDelegationsResponse>(
        `/cosmos/staking/v1beta1/delegations/${address}`,
      );
    const delegations = data.delegation_responses;
    const totalDelegated = delegations.reduce(
      (acc, cur) => acc + Number(cur.balance.amount),
      0,
    );
    return totalDelegated / 10 ** this.currency.decimals;
  };
  getRewards = async (address: string) => {
    const { data } =
      await this._provider.get<CosmosSDKBasedDelegationRewardsResponse>(
        `/cosmos/distribution/v1beta1/delegators/${address}/rewards`,
      );
    const osmosisRewards = data.total.find(
      (v) => v.denom === this.currency.coinMinimalDenom,
    );
    const totalRewards = Number(osmosisRewards?.amount ?? 0);
    return totalRewards / 10 ** this.currency.decimals;
  };
  getTokenBalances = async (walletAddress: string) => {
    const { data } = await this._getBalances(walletAddress);
    return data.balances.flatMap((asset) => {
      if (asset.denom === this.currency.coinMinimalDenom) {
        return [];
      }
      const tokenInfo = OSMOSIS_TOKENS.find(
        (tokenInfo) =>
          !!tokenInfo.denomUnits?.find((v) => v.denom === asset.denom),
      );
      if (!tokenInfo) {
        return [];
      }

      const decimals = tokenInfo.decimals;
      const balance =
        typeof asset.amount === 'string'
          ? Number(asset.amount) / 10 ** decimals
          : 0;
      if (balance <= 0) {
        return [];
      }

      const getPrice = () => {
        if (tokenInfo.coinGeckoId) {
          return undefined;
        }
        return 0;
      };
      const price = getPrice();

      return {
        walletAddress,
        platform: 'osmosis',
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals,
        logo: tokenInfo.logo,
        coinGeckoId: tokenInfo.coinGeckoId,
        balance,
        price,
      };
    });
  };
}

export const osmosisChain = new OsmosisChain();

const info: ChainInfo = {
  name: 'Osmosis',
  type: 'cosmos-sdk',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  return {
    tokens: [osmosisChain.currency],
    wallet: {
      tokenAmounts: {
        [osmosisChain.currency.ind]: await osmosisChain.getBalance(account),
      },
    },
  };
};
