import { safePromiseAll } from '@bento/common';
import { TokenInput } from '@bento/core';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';

import coingeckoTokenList from './coingecko-coin-list.json';
import {
  TRUSTWALLET_ASSETS_PATH,
  WORKSPACE_ROOT_PATH,
  stringify,
} from './config';

type TokenItem = {
  chainId: number;
  asset: string;
  type: 'ERC20' | 'coin' | unknown;
  address: string;
  name: string;
  symbol: string;
  decimals: 18;
  logoURI: string;
  pairs: { base: string }[];
};

const CHAIN_OUTPUT_PATH = path.resolve(
  WORKSPACE_ROOT_PATH,
  './packages/core/tokens/ethereum.json',
);

export const update = async () => {
  const result = await fs.readdir(
    path.resolve(TRUSTWALLET_ASSETS_PATH, './blockchains/ethereum'),
  );
  const tokensPromise = result.flatMap(async (filename) => {
    if (!filename.endsWith('.json')) {
      return [];
    }
    const filePath = path.resolve(
      TRUSTWALLET_ASSETS_PATH,
      './blockchains/ethereum',
      filename,
    );
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content).tokens as TokenItem[];
  });
  const tokens: TokenInput[] = (await safePromiseAll(tokensPromise))
    .flat()
    .flatMap((token) => {
      if (token.type !== 'ERC20') {
        return [];
      }
      const coinGeckoToken = coingeckoTokenList.find(
        (v) =>
          v.platforms.ethereum?.toLowerCase() === token.address.toLowerCase(),
      );
      let name: string = coinGeckoToken?.name ?? token.name;
      if (name === 'WETH') {
        name = 'Wrapped Ether';
      }
      return {
        symbol: token.symbol,
        name,
        decimals: token.decimals,
        address: token.address,
        coinGeckoId: coinGeckoToken?.id,
        logo: token.logoURI,
      };
    });

  const previousTokens = JSON.parse(
    await fs.readFile(CHAIN_OUTPUT_PATH, 'utf8'),
  ) as TokenInput[];
  const newTokens = tokens.reduce((acc, token) => {
    const prev = acc.find(
      (v) => v.address?.toLowerCase() === token.address?.toLowerCase(),
    );
    if (!prev) {
      acc.push(token);
    } else {
      // replace undefined values
      const index = acc.indexOf(prev);
      acc[index] = { ...acc[index], ...token };
    }
    return acc;
  }, previousTokens);

  await fs.writeFile(
    CHAIN_OUTPUT_PATH,
    prettier.format(stringify(newTokens), { parser: 'json' }),
    'utf8',
  );
};
