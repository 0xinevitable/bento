import { Config, safePromiseAllV1 } from '@bento/common';
import {
  BNB_TOKENS,
  Chain,
  Currency,
  EEEE_ADDRESS,
  TokenBalance,
  ZERO_ADDRESS,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { ChainGetAccount, ChainInfo } from '@/_lib/types';

export class BNBChain implements Chain {
  currency = {
    symbol: 'BNB',
    name: 'BNB',
    logo: '/assets/icons/bnb.png',
    decimals: 18,
    coinGeckoId: 'binancecoin',
    ind: ZERO_ADDRESS,
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

export const bnbChain = new BNBChain();

const info: ChainInfo = {
  name: 'Binance',
  type: 'evm',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  return {
    type: 'chain',
    tokens: [bnbChain.currency],
    wallet: {
      tokenAmounts: {
        [bnbChain.currency.ind]: await bnbChain.getBalance(account),
      },
    },
  };
};
