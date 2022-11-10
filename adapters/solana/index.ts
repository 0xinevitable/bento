import { safeAsyncFlatMap } from '@bento/common';
import { Currency, SOLANA_TOKENS, priceFromCoinGecko } from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

import { Chain, ChainGetAccount, ChainInfo } from '@/_lib/types';

const SOLANA_ZERO_ADDRESS = '0'.repeat(32);

export class SolanaChain implements Chain {
  currency = {
    symbol: 'SOL',
    name: 'Solana',
    logo: '/assets/icons/solana.png',
    decimals: 9,
    coinGeckoId: 'solana',
    ind: SOLANA_ZERO_ADDRESS,
  };
  chainId = 1399811149;
  _provider = new Connection(clusterApiUrl('mainnet-beta'));
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (account: string) => {
    const rawBalance = await this._provider.getBalance(new PublicKey(account));
    const balance = rawBalance / 10 ** this.currency.decimals;
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

export const solanaChain = new SolanaChain();

const info: ChainInfo = {
  name: 'Solana',
  type: 'sealevel',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  const items = await Promise.all([
    solanaChain.getBalance(account),
    (await solanaChain.getTokenBalances(account)).flat(),
  ]);
  return items.flat();
};
