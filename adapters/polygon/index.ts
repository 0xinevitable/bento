import { Config, safeAsyncFlatMap } from '@bento/common';
import {
  Currency,
  EEEE_ADDRESS,
  POLYGON_TOKENS,
  ZERO_ADDRESS,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { Chain, ChainGetAccount, ChainInfo } from '@/_lib/types';

export class PolygonChain implements Chain {
  currency = {
    symbol: 'MATIC',
    name: 'Polygon',
    logo: '/assets/icons/polygon.png',
    decimals: 18,
    coinGeckoId: 'matic-network',
    ind: ZERO_ADDRESS,
  };
  chainId = 137;
  _provider = new JsonRpcProvider(Config.RPC_URL.POLYGON_MAINNET);
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

const polygonChain = new PolygonChain();

const info: ChainInfo = {
  name: 'Polygon',
  type: 'evm',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  const items = await Promise.all([
    polygonChain.getBalance(account),
    (await polygonChain.getTokenBalances(account)).flat(),
  ]);
  return items.flat();
};
