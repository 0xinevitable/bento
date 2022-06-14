import { Base64, safePromiseAll } from '@bento/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import * as web3 from '@solana/web3.js';
import axios, { Axios } from 'axios';
import Caver from 'caver-js';

import { withCache } from '../cache';
import { priceFromCoinGecko } from '../pricings/CoinGecko';
import { Currency } from '../pricings/Currency';
import { ERC20TokenInput, ETHEREUM_TOKENS, KLAYTN_TOKENS } from '../tokens';
import { MinimalABIs } from './interfaces';

export interface ERC20TokenBalance extends ERC20TokenInput {
  walletAddress: string;
  balance: number;
  price: number;
}

export interface Chain {
  // 기반 통화(Native Token)
  currency: {
    symbol: string;
    name: string;
    logo?: string;
    decimals: number;
    coinGeckoId?: string;
    coinMinimalDenom?: string; // Only for Cosmos SDK based chains
  };
  _provider?: any;
  getCurrencyPrice: (currency?: Currency) => Promise<number>;
  getBalance: (address: string) => Promise<number>;
  getTokenBalances?: (address: string) => Promise<ERC20TokenBalance[]>;
}

export class EthereumChain implements Chain {
  currency = {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '/assets/ethereum.png',
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

  _API_KEYS = [
    'ckey_ec92d129ed8a498f9bca510830b:',
    'ckey_7af720dd03ef4a15afc1b44e2b4:',
  ];
  getTokenBalances = async (walletAddress: string) => {
    const API_KEY =
      this._API_KEYS[Math.floor(Math.random() * this._API_KEYS.length)];
    const { data } = await axios
      .get<TokenBalancesResponse>(
        `https://api.covalenthq.com/v1/1/address/${walletAddress}/balances_v2/`,
        {
          headers: {
            Authorization: `Basic ${Base64.encode(API_KEY)}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((error) => {
        console.error(error);
        return { data: { data: { items: [] } } };
      });

    const promises = data.data.items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // Klaytn
      ) {
        return [];
      }
      const balance =
        typeof token.balance === 'string'
          ? Number(token.balance) / 10 ** token.contract_decimals
          : 0;
      if (balance <= 0) {
        return [];
      }
      const symbol = token.contract_ticker_symbol;
      const tokenInfo = ETHEREUM_TOKENS.find(
        (v) => v.address === token.contract_address,
      );
      const getPrice = async () => {
        if (tokenInfo?.coinGeckoId || tokenInfo?.coinMarketCapId) {
          // return priceFromCoinMarketCap(tokenInfo.coinMarketCapId).catch(
          //   (error) => {
          //     console.error(error);
          //     return 0;
          //   },
          // );
          return undefined;
        }
        return 0;
      };
      const price = await getPrice();
      return {
        walletAddress,
        name: tokenInfo?.name ?? token.contract_name,
        symbol: tokenInfo?.symbol ?? symbol,
        decimals: token.contract_decimals,
        address: token.contract_address,
        logo: tokenInfo?.logo,
        coinGeckoId: tokenInfo?.coinGeckoId,
        coinMarketCapId: tokenInfo?.coinMarketCapId,
        balance,
        price,
      };
    }) as Promise<ERC20TokenBalance>[];
    return safePromiseAll(promises);
  };
}

export class PolygonChain implements Chain {
  currency = {
    symbol: 'MATIC',
    name: 'Polygon',
    logo: '/assets/polygon.webp',
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

export type TokenBalancesResponse = {
  data: {
    address: string;
    updated_at: string;
    next_update_at: string;
    quote_currency: string;
    chain_id: number;
    items: [
      {
        contract_decimals: number;
        contract_name: string;
        contract_ticker_symbol: string;
        contract_address: string;
        supports_erc: null;
        logo_url: string;
        last_transferred_at: null;
        type: 'cryptocurrency' | 'nft';
        balance: string;
        balance_24h: null;
        quote_rate: number;
        quote_rate_24h: number;
        quote: number | null;
        quote_24h: number | null;
        // nft_data: NFTData[] | null;
      },
    ];
    pagination: null;
  };
  error: false;
  error_message: null;
  error_code: null;
};

export class KlaytnChain implements Chain {
  currency = {
    symbol: 'KLAY',
    decimals: 18,
    name: 'Klaytn',
    logo: 'https://avatars.githubusercontent.com/u/41137100?s=200&v=4',
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

  public tokens: ERC20TokenInput[] = KLAYTN_TOKENS;

  _SCNR_KLAY_LP = '0xe1783a85616ad7dbd2b326255d38c568c77ffa26';
  _getStakedSCNRReserves = async () => {
    const lp = new this._provider.klay.Contract(
      MinimalABIs.LP,
      this._SCNR_KLAY_LP,
    );
    const { 0: reservesForSCNR, 1: reservesForKLAY } = await lp.methods
      .getReserves()
      .call();
    return { reservesForSCNR, reservesForKLAY };
  };
  _getSCNRTokenPrice = withCache(async () => {
    const [staked, klayPrice] = await Promise.all([
      this._getStakedSCNRReserves(),
      this.getCurrencyPrice(),
    ]);

    const { reservesForSCNR, reservesForKLAY } = staked;
    const amountOfSCNRStaked = reservesForSCNR / 10 ** 25;
    const amountOfKLAYStaked = reservesForKLAY / 10 ** this.currency.decimals;

    const exchangeRatio = amountOfKLAYStaked / amountOfSCNRStaked;
    return exchangeRatio * klayPrice;
  });
  _SCNR_ADDRESS = '0x8888888888885b073f3c81258c27e83db228d5f3';
  _SCNR_STAKING = '0x7c59930d1613ca2813e5793da72b324712f6899d';
  getStakedSCNRInGovernance = async (address: string) => {
    console.log(address, this._SCNR_STAKING);
    const staking = new this._provider.klay.Contract(
      MinimalABIs.Staking,
      this._SCNR_STAKING,
    );
    const stakedBalance = await staking.methods
      .stakedBalanceOf(address, this._SCNR_ADDRESS)
      .call();
    return stakedBalance / 10 ** 25;
  };

  _API_KEYS = [
    'ckey_ec92d129ed8a498f9bca510830b:',
    'ckey_7af720dd03ef4a15afc1b44e2b4:',
  ];

  getTokenBalances = async (walletAddress: string) => {
    const API_KEY =
      this._API_KEYS[Math.floor(Math.random() * this._API_KEYS.length)];

    const { data } = await axios
      .get<TokenBalancesResponse>(
        `https://api.covalenthq.com/v1/8217/address/${walletAddress}/balances_v2/`,
        {
          headers: {
            Authorization: `Basic ${Base64.encode(API_KEY)}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .catch((error) => {
        console.error(error);
        return { data: { data: { items: [] } } };
      });

    const promises = data.data.items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' // Klaytn
      ) {
        return [];
      }
      const balance =
        typeof token.balance === 'string'
          ? Number(token.balance) / 10 ** token.contract_decimals
          : 0;
      const symbol = token.contract_ticker_symbol;
      const STAKING_ENABLED = ['SCNR']; // stakable tokens can be indexed with balance 0

      if (balance <= 0 && !STAKING_ENABLED.includes(symbol)) {
        return [];
      }
      const tokenInfo = KLAYTN_TOKENS.find(
        (v) => v.address === token.contract_address,
      );
      const getPrice = async () => {
        if (tokenInfo?.coinGeckoId || tokenInfo?.coinMarketCapId) {
          // return priceFromCoinMarketCap(tokenInfo.coinMarketCapId).catch(
          //   (error) => {
          //     console.error(error);
          //     return 0;
          //   },
          // );
          return undefined;
        }
        if (symbol === 'SCNR') {
          return this._getSCNRTokenPrice().catch(() => 0);
        }
        return 0;
      };
      const price = await getPrice();
      const balanceInfo = {
        walletAddress,
        name: tokenInfo?.name ?? token.contract_name,
        symbol: tokenInfo?.symbol ?? symbol,
        decimals: token.contract_decimals,
        address: token.contract_address,
        logo: tokenInfo?.logo,
        coinGeckoId: tokenInfo?.coinGeckoId,
        coinMarketCapId: tokenInfo?.coinMarketCapId,
        staking: tokenInfo?.staking,
        balance,
        price,
      };
      if (symbol === 'SCNR') {
        const staked = await this.getStakedSCNRInGovernance(
          walletAddress,
        ).catch((error) => {
          console.error(error);
          // FIXME: Proper error handling
          return 0;
        });
        console.log({ staked });

        return [
          balanceInfo,
          { ...balanceInfo, balance: staked, staking: true },
        ];
      }
      return balanceInfo;
    }) as Promise<ERC20TokenBalance>[];
    return safePromiseAll(promises);
  };
}

export class SolanaChain implements Chain {
  currency = {
    symbol: 'SOL',
    name: 'Solana',
    logo: '/assets/solana.png',
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

type CosmosSDKBasedBalanceResponse = {
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
type CosmosSDKBasedDelegationsResponse = {
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

export interface CosmosSDKBasedChain extends Chain {
  bech32Config: {
    prefix: string;
  };
  getDelegations: (address: string) => Promise<number>;
}
export class CosmosHubChain implements CosmosSDKBasedChain {
  currency = {
    symbol: 'ATOM',
    name: 'Cosmos Hub',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png',
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
    const { data } = await this._provider.get<CosmosSDKBasedBalanceResponse>(
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

export class OsmosisChain implements CosmosSDKBasedChain {
  currency = {
    symbol: 'OSMO',
    name: 'Osmosis',
    logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png',
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
    const { data } = await this._provider.get<CosmosSDKBasedBalanceResponse>(
      `/cosmos/bank/v1beta1/balances/${address}`,
    );
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
}
