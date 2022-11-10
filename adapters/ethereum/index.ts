import { Config, safeAsyncFlatMap } from '@bento/common';
import {
  Currency,
  EEEE_ADDRESS,
  ETHEREUM_TOKENS,
  ZERO_ADDRESS,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { AxiosError } from 'axios';

import { Chain, ChainGetAccount, ChainInfo } from '@/_lib/types';

export class EthereumChain implements Chain {
  currency = {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: '/assets/icons/ethereum.png',
    decimals: 18,
    coinGeckoId: 'ethereum',
    ind: ZERO_ADDRESS,
  };
  chainId = 1;
  _provider = new JsonRpcProvider(Config.RPC_URL.ETHEREUM_MAINNET);
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
        const tokenInfo = ETHEREUM_TOKENS.find(
          (v) => v.address.toLowerCase() === token.contract_address,
        );
        const getPrice = async () => {
          if (tokenInfo?.coinGeckoId || tokenInfo?.coinMarketCapId) {
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

export const ethereumChain = new EthereumChain();

const info: ChainInfo = {
  name: 'Ethereum',
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
    ethereumChain.getBalance(account),
    (await retry(0, ethereumChain.getTokenBalances(account))).flat(),
  ]);
  return items.flat();
};

export const TEST_ADDRESS = '0x7777777141f111cf9f0308a63dbd9d0cad3010c4';
