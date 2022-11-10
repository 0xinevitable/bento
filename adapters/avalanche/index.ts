import { Config, safeAsyncFlatMap } from '@bento/common';
import {
  AVALANCHE_TOKENS,
  Currency,
  EEEE_ADDRESS,
  ZERO_ADDRESS,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { JsonRpcProvider } from '@ethersproject/providers';

import { Chain, ChainGetAccount, ChainInfo } from '@/_lib/types';

export class AvalancheChain implements Chain {
  currency = {
    symbol: 'AVAX',
    name: 'Avalanche',
    logo: '/assets/icons/avalanche.png',
    decimals: 18,
    coinGeckoId: 'avalanche-2',
    ind: ZERO_ADDRESS,
  };
  chainId = 43114;
  _provider = new JsonRpcProvider(Config.RPC_URL.AVALANCHE_C_MAINNET);
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
        if (token.contract_address === EEEE_ADDRESS) {
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
          (v) =>
            v.address.toLowerCase() === token.contract_address.toLowerCase(),
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

export const avalancheChain = new AvalancheChain();

const info: ChainInfo = {
  name: 'Avalanche',
  type: 'evm',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  const items = await Promise.all([
    avalancheChain.getBalance(account),
    (await avalancheChain.getTokenBalances(account)).flat(),
  ]);
  return items.flat();
};

export const TEST_ADDRESS = '0x00a386afb1524b572de7ea0a3aaad25cdf7e749a';
