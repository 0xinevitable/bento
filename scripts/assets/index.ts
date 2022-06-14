import { safePromiseAll } from '@bento/common';
import { ERC20TokenInput } from '@bento/core/lib/tokens';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';
import TSON from 'typescript-json';

import coingeckoTokenList from './coingecko-coin-list.json';

const TRUSTWALLET_ASSETS_PATH = './assets/trustwallet-assets';
const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
const CHAINS = {
  ETHEREUM: {
    key: 'ethereum',
    path: path.resolve(
      WORKSPACE_ROOT_PATH,
      './packages/bento-core/src/tokens/ethereum.json',
    ),
  },
  BSC: {
    key: 'binance',
    path: path.resolve(
      WORKSPACE_ROOT_PATH,
      './packages/bento-core/src/tokens/bsc.json',
    ),
  },
  POLYGON: {
    key: 'polygon',
    path: path.resolve(
      WORKSPACE_ROOT_PATH,
      './packages/bento-core/src/tokens/polygon.json',
    ),
  },
  // SOLANA: {
  //   key: 'solana',
  //   path: path.resolve(
  //     WORKSPACE_ROOT_PATH,
  //     './packages/bento-core/src/tokens/solana.json',
  //   ),
  // },
};

type TokenItem = {
  chainId: number;
  asset: string;
  type: 'ERC20' | unknown;
  address: string;
  name: string;
  symbol: string;
  decimals: 18;
  logoURI: string;
  pairs: { base: string }[];
};

const stringify = TSON.createStringifier<ERC20TokenInput[]>();

const updateAssets = async (chain: { key: string; path: string }) => {
  const result = await fs.readdir(
    path.resolve(TRUSTWALLET_ASSETS_PATH, `./blockchains/${chain.key}`),
  );
  const tokensPromise = result.flatMap(async (filename) => {
    if (!filename.endsWith('.json')) {
      return [];
    }
    const filePath = path.resolve(
      TRUSTWALLET_ASSETS_PATH,
      `./blockchains/${chain.key}`,
      filename,
    );
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content).tokens as TokenItem[];
  });
  const tokens: ERC20TokenInput[] = (await safePromiseAll(tokensPromise))
    .flat()
    .flatMap((token) => {
      if (
        (chain.key === 'ethereum' && token.type !== 'ERC20') ||
        token.type === 'coin'
      ) {
        return [];
      }
      const coinGeckoId = coingeckoTokenList.find(
        (v) =>
          v.name.toLowerCase() === token.name.toLowerCase() &&
          v.symbol.toLowerCase() === token.name.toLowerCase(),
      )?.id;
      return {
        symbol: token.symbol,
        name: token.symbol,
        decimals: token.decimals,
        address: token.address,
        coinGeckoId,
        logo: token.logoURI,
      };
    });

  const previousTokens = JSON.parse(
    await fs.readFile(chain.path, 'utf8'),
  ) as ERC20TokenInput[];
  const newTokens = tokens.reduce((acc, token) => {
    if (
      !acc.find((v) => v.address.toLowerCase() === token.address.toLowerCase())
    ) {
      acc.push(token);
    }
    return acc;
  }, previousTokens);

  await fs.writeFile(
    chain.path,
    prettier.format(stringify(newTokens), { parser: 'json' }),
    'utf8',
  );
};

const main = async () =>
  safePromiseAll(
    Object.values(CHAINS).map(async (chain) => {
      await updateAssets(chain);
    }),
  );

main();
