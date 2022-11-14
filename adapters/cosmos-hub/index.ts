import { Currency, priceFromCoinGecko, withCache } from '@bento/core';
import axios, { Axios } from 'axios';

import { ChainGetAccount, ChainInfo } from '@/_lib/types';
import {
  CosmosHubDelegationsResponse,
  CosmosSDKBasedBalanceResponse,
  CosmosSDKBasedChain,
} from '@/_lib/types/cosmos-sdk';

export class CosmosHubChain implements CosmosSDKBasedChain {
  currency = {
    symbol: 'ATOM',
    name: 'Cosmos Hub',
    logo: '/assets/icons/cosmos-hub.png',
    decimals: 6,
    coinGeckoId: 'cosmos',
    coinMinimalDenom: 'uatom',
    ind: 'uatom',
  };
  bech32Config = {
    prefix: 'cosmos',
  };
  _provider: Axios = axios.create({
    baseURL: 'https://api.cosmos.network',
    timeout: 4_000,
  });
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);

  _getBalances = withCache(async (address: string) =>
    this._provider.get<CosmosSDKBasedBalanceResponse>(
      `/cosmos/bank/v1beta1/balances/${address}`,
    ),
  );
  getBalance = async (account: string) => {
    const { data } = await this._getBalances(account);
    const coinBalance =
      data.balances.find((v) => v.denom === this.currency.coinMinimalDenom)
        ?.amount ?? 0;
    const balance = Number(coinBalance) / 10 ** this.currency.decimals;
    return { ...this.currency, balance };
  };
  getDelegations = async (account: string) => {
    try {
      const { data } = await this._provider.get<CosmosHubDelegationsResponse>(
        `/staking/delegators/${account}/delegations`,
      );
      const delegations = data.result;
      const totalDelegated = delegations.reduce(
        (acc, cur) => acc + Number(cur.balance.amount),
        0,
      );
      return totalDelegated / 10 ** this.currency.decimals;
    } catch (err) {
      throw err;
    }
  };
  getTokenBalances = async (_account: string) => {
    // const { data } = await this._getBalances(address);
    // return data.balances as any;
    return [];
  };
}

export const cosmosHubChain = new CosmosHubChain();

const info: ChainInfo = {
  name: 'Cosmos Hub',
  type: 'cosmos-sdk',
  bech32Config: cosmosHubChain.bech32Config,
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  const items = await Promise.all([
    cosmosHubChain.getBalance(account),
    (await cosmosHubChain.getTokenBalances(account)).flat(),
  ]);
  return items.flat();
};
