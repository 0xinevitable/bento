import { JsonRpcProvider } from '@ethersproject/providers';
import * as web3 from '@solana/web3.js';
import axios, { Axios } from 'axios';
import Caver from 'caver-js';
import queryString from 'query-string';

export type Currency = 'usd';
export const priceFromCoinGecko = async (
  coinGeckoId: string,
  vsCurrency: Currency = 'usd',
) => {
  const url = queryString.stringifyUrl({
    url: 'https://api.coingecko.com/api/v3/simple/price',
    query: {
      ids: coinGeckoId,
      vs_currencies: vsCurrency,
    },
  });
  const { data } = await axios.get(url);
  return data[coinGeckoId][vsCurrency];
};

export interface Chain {
  currency: {
    symbol: string;
    decimals: number;
    coinGeckoId?: string;
    coinMinimalDenom?: string; // Only tendermint-based
  };
  _provider?: any;
  getCurrencyPrice: (currency?: Currency) => Promise<number>;
  getBalance: (address: string) => Promise<number>;
}

export class EthereumChain implements Chain {
  currency = {
    symbol: 'ETH',
    decimals: 18,
    coinGeckoId: 'ethereum',
  };
  _provider = new JsonRpcProvider(
    'https://mainnet.infura.io/v3/fcb656a7b4d14c9f9b0803a5d7475877',
  );
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };
}

export class PolygonChain implements Chain {
  currency = {
    symbol: 'MATIC',
    decimals: 18,
    coinGeckoId: 'matic-network',
  };
  _provider = new JsonRpcProvider('https://polygon-rpc.com');
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };
}

export class KlaytnChain implements Chain {
  currency = {
    symbol: 'KLAY',
    decimals: 18,
    coinGeckoId: 'klay-token',
  };
  _provider = new Caver('https://public-node-api.klaytnapi.com/v1/cypress');
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.klay.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };
}

export class SolanaChain implements Chain {
  currency = {
    symbol: 'SOL',
    decimals: 9,
    coinGeckoId: 'solana',
  };
  _provider = new web3.Connection(web3.clusterApiUrl('mainnet-beta'));
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(
      new web3.PublicKey(address),
    );
    const balance = rawBalance / 10 ** this.currency.decimals;
    return balance;
  };
}

type TendermintBalanceResponse = {
  balances: [
    {
      denom: string;
      amount: string;
    },
  ];
  pagination: {
    next_key: null;
    total: string; // number-like
  };
};
type CosmosHubDelegationsResponse = {
  height: string; // number-like
  result: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string; // number-like
    };
    balance: {
      denom: string;
      amount: string; // number-like
    };
  }[];
};
type TendermintDelegationsResponse = {
  delegation_responses: {
    delegation: {
      delegator_address: string;
      validator_address: string;
      shares: string; // number-like
    };
    balance: {
      denom: string;
      amount: string; // number-like
    };
  }[];
  pagination: {
    next_key: null;
    total: string; // number-like
  };
};

export interface TendermintChain extends Chain {
  bech32Config: {
    prefix: string;
  };
  getDelegations: (address: string) => Promise<number>;
}
export class CosmosHubChain implements TendermintChain {
  currency = {
    symbol: 'ATOM',
    decimals: 6,
    coinGeckoId: 'cosmos',
    coinMinimalDenom: 'uatom',
  };
  bech32Config = {
    prefix: 'cosmos',
  };
  _provider: Axios = axios.create({
    baseURL: 'https://api.cosmos.network',
  });
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);

  getBalance = async (address: string) => {
    const { data } = await this._provider.get<TendermintBalanceResponse>(
      `/cosmos/bank/v1beta1/balances/${address}`,
    );
    const coinBalance =
      data.balances.find((v) => v.denom === this.currency.coinMinimalDenom)
        ?.amount ?? 0;
    const balance = Number(coinBalance) / 10 ** this.currency.decimals;
    return balance;
  };
  getDelegations = async (address: string) => {
    const { data } = await this._provider.get<CosmosHubDelegationsResponse>(
      `/staking/delegators/${address}/delegations`,
    );
    const delegations = data.result;
    const totalDelegated = delegations.reduce(
      (acc, cur) => acc + Number(cur.balance.amount),
      0,
    );
    return totalDelegated / 10 ** this.currency.decimals;
  };
}

export class OsmosisChain implements TendermintChain {
  currency = {
    symbol: 'OSMO',
    decimals: 6,
    coinGeckoId: 'osmosis',
    coinMinimalDenom: 'uosmo',
  };
  bech32Config = {
    prefix: 'osmo',
  };
  _provider: Axios = axios.create({
    baseURL: 'https://osmosis.stakesystems.io',
  });
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);

  getBalance = async (address: string) => {
    const { data } = await this._provider.get<TendermintBalanceResponse>(
      `/cosmos/bank/v1beta1/balances/${address}`,
    );
    const coinBalance =
      data.balances.find((v) => v.denom === this.currency.coinMinimalDenom)
        ?.amount ?? 0;
    const balance = Number(coinBalance) / 10 ** this.currency.decimals;
    return balance;
  };
  getDelegations = async (address: string) => {
    const { data } = await this._provider.get<TendermintDelegationsResponse>(
      `/cosmos/staking/v1beta1/delegations/${address}`,
    );
    const delegations = data.delegation_responses;
    const totalDelegated = delegations.reduce(
      (acc, cur) => acc + Number(cur.balance.amount),
      0,
    );
    return totalDelegated / 10 ** this.currency.decimals;
  };
}
