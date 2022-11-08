import { safePromiseAllV1 } from '@bento/common';
import {
  Chain,
  Currency,
  SOLANA_TOKENS,
  TokenBalance,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

import { ChainGetAccount, ChainInfo } from '@/_lib/types';

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

export const solanaChain = new SolanaChain();

const info: ChainInfo = {
  name: 'Solana',
  type: 'sealevel',
};
export default info;

export const getAccount: ChainGetAccount = async (account) => {
  return {
    type: 'chain',
    tokens: [solanaChain.currency],
    wallet: {
      tokenAmounts: {
        [solanaChain.currency.ind]: await solanaChain.getBalance(account),
      },
    },
  };
};
