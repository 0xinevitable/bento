import { Config, safePromiseAllV1 } from '@bento/common';
import {
  AVALANCHE_TOKENS,
  Chain,
  Currency,
  EEEE_ADDRESS,
  TokenBalance,
  priceFromCoinGecko,
} from '@bento/core';
import { getTokenBalancesFromCovalent } from '@bento/core/indexers';
import { JsonRpcProvider } from '@ethersproject/providers';

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
