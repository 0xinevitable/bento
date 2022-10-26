import { Config, safePromiseAllV1 } from '@bento/common';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import axios, { Axios } from 'axios';
import Caver from 'caver-js';

import { EEEE_ADDRESS } from '../address';
import { withCache } from '../cache';
import { priceFromCoinGecko } from '../pricings/CoinGecko';
import { Currency } from '../pricings/Currency';
import {
  AVALANCHE_TOKENS,
  BNB_TOKENS,
  ETHEREUM_TOKENS,
  KLAYTN_TOKENS,
  OSMOSIS_TOKENS,
  POLYGON_TOKENS,
  SOLANA_TOKENS,
  TokenInput,
} from '../tokens';
import { MinimalABIs } from './abi';
import { getTokenBalancesFromCovalent } from './indexers/Covalent';
import { Chain, TokenBalance } from './interfaces';

export type { Chain, TokenBalance };

export class EthereumChain implements Chain {
  currency = {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '/assets/icons/ethereum.png',
    decimals: 18,
    coinGeckoId: 'ethereum',
  };
  chainId = 1;
  _provider = new JsonRpcProvider(Config.RPC_URL.ETHEREUM_MAINNET);
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };

  getTokenBalances = async (walletAddress: string) => {
    const items = await getTokenBalancesFromCovalent({
      chainId: this.chainId,
      walletAddress,
    });

    const promises = items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === EEEE_ADDRESS // Klaytn
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
        (v) => v.address.toLowerCase() === token.contract_address,
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
        platform: 'ethereum',
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
    }) as Promise<TokenBalance>[];
    return safePromiseAllV1(promises);
  };
}

export class BNBChain implements Chain {
  currency = {
    symbol: 'BNB',
    name: 'BNB',
    logo: '/assets/icons/bnb.png',
    decimals: 18,
    coinGeckoId: 'binancecoin',
  };
  chainId = 56;
  _provider = new JsonRpcProvider(Config.RPC_URL.BNB_MAINNET);
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };

  getTokenBalances = async (walletAddress: string) => {
    const items = await getTokenBalancesFromCovalent({
      chainId: this.chainId,
      walletAddress,
    });

    const promises = items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === EEEE_ADDRESS // Klaytn
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
      const tokenInfo = BNB_TOKENS.find(
        (v) => v.address.toLowerCase() === token.contract_address,
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
        platform: 'bnb',
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
    }) as Promise<TokenBalance>[];
    return safePromiseAllV1(promises);
  };
}

export class PolygonChain implements Chain {
  currency = {
    symbol: 'MATIC',
    name: 'Polygon',
    logo: '/assets/icons/polygon.png',
    decimals: 18,
    coinGeckoId: 'matic-network',
  };
  chainId = 137;
  _provider = new JsonRpcProvider(Config.RPC_URL.POLYGON_MAINNET);
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };

  getTokenBalances = async (walletAddress: string) => {
    const items = await getTokenBalancesFromCovalent({
      chainId: this.chainId,
      walletAddress,
    });

    const promises = items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === EEEE_ADDRESS // Klaytn
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
      const tokenInfo = POLYGON_TOKENS.find(
        (v) => v.address.toLowerCase() === token.contract_address,
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
        platform: 'polygon',
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
    }) as Promise<TokenBalance>[];
    return safePromiseAllV1(promises);
  };
}

export class AvalancheChain implements Chain {
  currency = {
    symbol: 'AVAX',
    name: 'Avalanche',
    logo: '/assets/icons/avalanche.png',
    decimals: 18,
    coinGeckoId: 'avalanche-2',
  };
  chainId = 43114;
  _provider = new JsonRpcProvider(Config.RPC_URL.AVALANCHE_C_MAINNET);
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };

  getTokenBalances = async (walletAddress: string) => {
    const items = await getTokenBalancesFromCovalent({
      chainId: this.chainId,
      walletAddress,
    });

    const promises = items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === EEEE_ADDRESS // Klaytn
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
      const tokenInfo = AVALANCHE_TOKENS.find(
        (v) => v.address.toLowerCase() === token.contract_address.toLowerCase(),
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
        platform: 'avalanche',
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
    }) as Promise<TokenBalance>[];
    return safePromiseAllV1(promises);
  };
}

export class KlaytnChain implements Chain {
  currency = {
    symbol: 'KLAY',
    decimals: 18,
    name: 'Klaytn',
    logo: '/assets/icons/klaytn.png',
    coinGeckoId: 'klay-token',
  };
  chainId = 8217;
  _provider = new Caver(Config.RPC_URL.KLAYTN_MAINNET);
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.klay.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return balance;
  };

  public tokens: TokenInput[] = KLAYTN_TOKENS;

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

  getTokenBalances = async (walletAddress: string) => {
    const items = await getTokenBalancesFromCovalent({
      chainId: this.chainId,
      walletAddress,
    });

    const promises = items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === EEEE_ADDRESS // Klaytn
      ) {
        return [];
      }
      const balance =
        typeof token.balance === 'string'
          ? Number(token.balance) / 10 ** token.contract_decimals
          : 0;
      const symbol = token.contract_ticker_symbol;

      if (balance <= 0) {
        return [];
      }
      const tokenInfo = KLAYTN_TOKENS.find(
        (v) => v.address.toLowerCase() === token.contract_address,
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

        // FIXME: Remove hardcoded
        if (symbol === 'SCNR') {
          return this._getSCNRTokenPrice().catch(() => 0);
        }
        return 0;
      };

      const price = await getPrice();
      const balanceInfo = {
        walletAddress,
        platform: 'klaytn',
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
      return balanceInfo;
    }) as Promise<TokenBalance>[];
    return safePromiseAllV1(promises);
  };
}

export class SolanaChain implements Chain {
  currency = {
    symbol: 'SOL',
    name: 'Solana',
    logo: '/assets/icons/solana.png',
    decimals: 9,
    coinGeckoId: 'solana',
  };
  chainId = 1399811149;
  _provider = new Connection(clusterApiUrl('mainnet-beta'));
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.getBalance(new PublicKey(address));
    const balance = rawBalance / 10 ** this.currency.decimals;
    return balance;
  };

  getTokenBalances = async (walletAddress: string) => {
    const items = await getTokenBalancesFromCovalent({
      chainId: this.chainId,
      walletAddress,
    });

    const promises = items.flatMap(async (token) => {
      if (token.type === 'nft') {
        return [];
      }
      if (
        token.contract_address === '11111111111111111111111111111111' // Klaytn
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
      const tokenInfo = SOLANA_TOKENS.find(
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
        platform: 'solana',
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
    }) as Promise<TokenBalance>[];
    return safePromiseAllV1(promises);
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
type CosmosSDKBasedDelegationRewardsResponse = {
  rewards: [
    {
      validator_address: string;
      reward: {
        denom: string;
        amount: string; // number-like
      }[];
    },
  ];
  total: [
    {
      denom: string;
      amount: string; // number-like
    },
  ];
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
    logo: '/assets/icons/cosmos-hub.png',
    decimals: 6,
    coinGeckoId: 'cosmos',
    coinMinimalDenom: 'uatom',
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
  getBalance = async (address: string) => {
    const { data } = await this._getBalances(address);
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
  getTokenBalances = async (_address: string) => {
    // const { data } = await this._getBalances(address);
    // return data.balances as any;
    return [];
  };
}

export class OsmosisChain implements CosmosSDKBasedChain {
  currency = {
    symbol: 'OSMO',
    name: 'Osmosis',
    logo: '/assets/icons/osmosis.png',
    decimals: 6,
    coinGeckoId: 'osmosis',
    coinMinimalDenom: 'uosmo',
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
      // const denomUnits = OSMOSIS_TOKENS.flatMap((t) => t.denomUnits || []);

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
