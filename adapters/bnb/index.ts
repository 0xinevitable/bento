import { Config, safeAsyncFlatMap } from '@bento/common';
import {
  BNB_TOKENS,
  Currency,
  EEEE_ADDRESS,
  ZERO_ADDRESS,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AxiosError } from 'axios';

import { Chain, ChainGetAccount, ChainInfo } from '@/_lib/types';

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
  getBalance = async (account: string) => {
    const rawBalance = await this._provider.getBalance(account);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return { ...this.currency, balance };
  };

  getTokenBalances = async (account: string) => {
    try {
      const items = await getTokenBalancesFromCovalent({
        chainId: this.chainId,
        account,
      });

      const promises = safeAsyncFlatMap(items, async (token) => {
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
          name: tokenInfo?.name ?? token.contract_name,
          symbol: tokenInfo?.symbol ?? symbol,
          decimals: token.contract_decimals,
          ind: token.contract_address,
          logo: tokenInfo?.logo,
          coinGeckoId: tokenInfo?.coinGeckoId,
          coinMarketCapId: tokenInfo?.coinMarketCapId,
          balance,
          price,
        };
      });
      return promises;
    } catch (err) {
      throw err;
    }
  };
}

export const bnbChain = new BNBChain();

const info: ChainInfo = {
  name: 'Binance',
  type: 'evm',
};
export default info;

// TODO: Use in all adapters
const retry = async <K extends any>(
  n: number,
  promise: Promise<K>,
): Promise<K> => {
  if (n > 3) {
    return promise;
  }
  console.log('retry', n);
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return new Promise<K>((resolve, reject) => {
    promise
      .then((res) => resolve(res))
      .catch((error) => {
        console.error(n, error.message);
        if (error instanceof AxiosError) {
          retry(n + 1, promise)
            .then(resolve)
            .catch(reject);
        }
      });
  });
};

export const getAccount: ChainGetAccount = async (account) => {
  const items = await Promise.all([
    bnbChain.getBalance(account),
    (await retry(0, bnbChain.getTokenBalances(account))).flat(),
  ]);
  return items.flat();
};

export const TEST_ADDRESS = '0xe45cff0076a9031384b96cb7332e8129ff9ecf59';
