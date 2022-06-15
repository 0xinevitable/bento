import { cachedAxios } from '@bento/client';
import { safePromiseAll } from '@bento/common';
import { pricesFromCoinGecko } from '@bento/core/lib/pricings/CoinGecko';
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

const updateBNBAssets = async () => {
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
      cachedAxios.get('https://tokens.pancakeswap.finance/cmc.json'),
      cachedAxios.get('https://tokens.pancakeswap.finance/coingecko.json'),
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

  const tokens: ERC20TokenInput[] = bnbTokens.flatMap((token) => {
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
    [[]] as ERC20TokenInput[][],
  );

  const promises = chunks.map(async (chunk) => {
    const prices = await pricesFromCoinGecko(
      chunk.map((token) => token.coinGeckoId!),
    );
    return chunk.flatMap((token) => {
      const price = prices[token.coinGeckoId!];
      if (!price || price < 0.1) {
        return [];
      }
      return { ...token };
    });
  });

  let index: number = 0;
  let newTokenChunks: ERC20TokenInput[][] = [];
  for (const chunk of promises) {
    console.log(index);
    index += 1;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    newTokenChunks = newTokenChunks.concat(await chunk);
  }

  const CHAIN_OUTPUT_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './packages/bento-core/src/tokens/bsc.json',
  );

  let previousTokens: ERC20TokenInput[] = [];
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

const updateSolanaAssets = async () => {
  const tokenIds = await fs.readdir(
    path.resolve(TRUSTWALLET_ASSETS_PATH, './blockchains/solana/assets'),
  );
  const tokens = await safePromiseAll(
    tokenIds.map(async (tokenAddress) => {
      const infoFilePath = path.resolve(
        TRUSTWALLET_ASSETS_PATH,
        `./blockchains/solana/assets/${tokenAddress}/info.json`,
      );
      const token = JSON.parse(await fs.readFile(infoFilePath, 'utf8'));
      const coinGeckoToken = coingeckoTokenList.find(
        (v) => v.platforms.solana === tokenAddress,
      );
      const logoURI = `https://assets-cdn.trustwallet.com/blockchains/solana/assets/${tokenAddress}/logo.png`;

      return {
        symbol: token.symbol,
        name: coinGeckoToken?.name ?? token.name,
        decimals: token.decimals,
        address: tokenAddress,
        coinGeckoId: coinGeckoToken?.id,
        logo: logoURI,
      };
    }),
  );

  const CHAIN_OUTPUT_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './packages/bento-core/src/tokens/solana.json',
  );

  let previousTokens: ERC20TokenInput[] = [];
  try {
    previousTokens = JSON.parse(await fs.readFile(CHAIN_OUTPUT_PATH, 'utf8'));
  } catch {}

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

const main = async () =>
  safePromiseAll([
    ...Object.values(CHAINS).map(async (chain) => {
      await updateAssets(chain);
    }),
    // updateBNBAssets(),
    updateSolanaAssets(),
  ]);

main().catch(console.error);
