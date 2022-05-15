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
  };
  _provider?: any;
  getCurrencyPrice: (currency?: Currency) => number | Promise<number>;
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

export class KlaytnChain implements Chain {
  currency = {
    symbol: 'KLAY',
    decimals: 18,
    coinGeckoId: 'klaytn',
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

// FIXME: Tendermint chains need it's own handler for `coinMinimalDenom`, IBC, multiple currencies...

type TendermintBalanceResponse = {
  balances: [
    {
      denom: 'uatom' | 'uosmo';
      amount: string;
    },
  ];
  pagination: {
    next_key: null;
    total: string; // number-like
  };
};

export class CosmosHubChain implements Chain {
  currency = {
    symbol: 'ATOM',
    decimals: 6,
    coinGeckoId: 'cosmos',
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
    const atomBalance =
      data.balances.find((v) => v.denom === 'uatom')?.amount ?? 0;
    const balance = Number(atomBalance) / 10 ** this.currency.decimals;
    return balance;
  };
}

export class OsmosisChain implements Chain {
  currency = {
    symbol: 'OSMO',
    decimals: 6,
    coinGeckoId: 'osmosis',
  };
  _provider: Axios = axios.create({
    baseURL: 'https://lcd.dev-osmosis.zone',
  });
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);

  getBalance = async (address: string) => {
    const { data } = await this._provider.get<TendermintBalanceResponse>(
      `/cosmos/bank/v1beta1/balances/${address}`,
    );
    const atomBalance =
      data.balances.find((v) => v.denom === 'uosmo')?.amount ?? 0;
    const balance = Number(atomBalance) / 10 ** this.currency.decimals;
    return balance;
  };
}
