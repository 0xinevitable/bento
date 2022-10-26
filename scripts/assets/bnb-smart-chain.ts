import { safePromiseAll } from '@bento/common';
import { TokenInput } from '@bento/core';
import { pricesFromCoinGecko } from '@bento/core';
import axios from 'axios';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';

import coingeckoTokenList from './coingecko-coin-list.json';
import { WORKSPACE_ROOT_PATH, stringify } from './config';

export const update = async () => {
  const [pancakeSwapCMCAssetList, pancakeSwapCoinGeckoAssetList] = (
    await safePromiseAll<{
      data: {
        tokens: {
          name: string;
          symbol: string;
          address: string;
          chainId: number;
          decimals: number;
          logoURI: string;
        }[];
      };
    }>([
      axios.get('https://tokens.pancakeswap.finance/cmc.json'),
      axios.get('https://tokens.pancakeswap.finance/coingecko.json'),
    ])
  ).map((v) => v.data.tokens);

  // List is up to 7108 tokens, so we need to filter them out
  const bnbTokens = pancakeSwapCMCAssetList.reduce((acc, token) => {
    if (
      !acc.find(
        (v) =>
          v.address.toLowerCase() === token.address.toLowerCase() &&
          v.symbol.toLowerCase() === token.symbol.toLowerCase(),
      )
    ) {
      acc.push(token);
    }
    return acc;
  }, pancakeSwapCoinGeckoAssetList);

  const tokens: TokenInput[] = bnbTokens.flatMap((token) => {
    const coinGeckoToken = coingeckoTokenList.find(
      (v) =>
        v.platforms['binance-smart-chain']?.toLowerCase() ===
        token.address.toLowerCase(),
    );
    if (!coinGeckoToken) {
      return [];
    }
    return {
      symbol: token.symbol.replace('$', ''),
      name: coinGeckoToken?.name ?? token.name,
      decimals: token.decimals,
      address: token.address,
      coinGeckoId: coinGeckoToken?.id,
      logo: token.logoURI,
    };
  });

  const chunks = tokens.reduce(
    (acc, token, index) => {
      if (index % 200 === 0) {
        acc.push([]);
      }
      acc[acc.length - 1].push(token);
      return acc;
    },
    [[]] as TokenInput[][],
  );

  const promises = chunks.map(async (chunk) => {
    const coinGeckoIds = chunk.flatMap((token) => token.coinGeckoId!);
    if (coinGeckoIds.length === 0) {
      return [];
    }
    const prices = await pricesFromCoinGecko(coinGeckoIds);
    return chunk.flatMap((token) => {
      const price = prices[token.coinGeckoId!];
      if (!price || price < 0.1) {
        return [];
      }
      return { ...token };
    });
  });

  let index: number = 0;
  let newTokenChunks: TokenInput[][] = [];
  for (const chunk of promises) {
    console.log(index);
    index += 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    newTokenChunks = newTokenChunks.concat(await chunk);
  }

  const CHAIN_OUTPUT_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './packages/core/tokens/bnb.json',
  );

  let previousTokens: TokenInput[] = [];
  try {
    previousTokens = JSON.parse(await fs.readFile(CHAIN_OUTPUT_PATH, 'utf8'));
  } catch {}

  const newTokens = newTokenChunks.flat().reduce((acc, token) => {
    const prev = acc.find(
      (v) => v.address?.toLowerCase() === token.address?.toLowerCase(),
    );
    if (!prev) {
      acc.push(token);
    } else {
      // replace undefined values
      const index = acc.indexOf(prev);
      acc[index] = {
        ...acc[index],
        ...token,
        logo: acc[index].logo ?? token.logo,
      };
    }
    return acc;
  }, previousTokens);

  await fs.writeFile(
    CHAIN_OUTPUT_PATH,
    prettier.format(stringify(newTokens), { parser: 'json' }),
    'utf8',
  );
};
