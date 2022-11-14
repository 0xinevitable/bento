import { Config, safeAsyncFlatMap } from '@bento/common';
import {
  Currency,
  EEEE_ADDRESS,
  KLAYTN_TOKENS,
  TokenInput,
  ZERO_ADDRESS,
  priceFromCoinGecko,
  withCache,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import Caver from 'caver-js';
import { Multicall } from 'klaytn-multicall';

import { Chain } from '@/_lib/types';

export class KlaytnChain implements Chain {
  currency = {
    symbol: 'KLAY',
    decimals: 18,
    name: 'Klaytn',
    logo: '/assets/icons/klaytn.png',
    coinGeckoId: 'klay-token',
    ind: ZERO_ADDRESS,
  };
  chainId = 8217;
  _provider = new Caver(Config.RPC_URL.KLAYTN_MAINNET);
  getCurrencyPrice = (currency: Currency = 'usd') =>
    priceFromCoinGecko(this.currency.coinGeckoId, currency);
  getBalance = async (address: string) => {
    const rawBalance = await this._provider.klay.getBalance(address);
    const balance = Number(rawBalance) / 10 ** this.currency.decimals;
    return { ...this.currency, balance };
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

export const klaytnChain = new KlaytnChain();
export const multicall = new Multicall({ provider: klaytnChain._provider });

export const MinimalABIs = {
  ERC20: [
    {
      inputs: [
        {
          internalType: 'address',
          name: 'who',
          type: 'address',
        },
      ],
      name: 'balanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
      ],
      type: 'function',
    },
  ],
  LP: [
    {
      inputs: [],
      name: 'getReserves',
      outputs: [
        { internalType: 'uint112', name: '_reserve0', type: 'uint112' },
        { internalType: 'uint112', name: '_reserve1', type: 'uint112' },
        { internalType: 'uint32', name: '_blockTimestampLast', type: 'uint32' },
      ],
      type: 'function',
    },
    {
      inputs: [],
      name: 'totalSupply',
      outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
      type: 'function',
    },
  ],
};
