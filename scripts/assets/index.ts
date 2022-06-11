import { ERC20TokenInput } from '@bento/core/lib/tokens';
import { safePromiseAll } from '@bento/core/lib/utils/safePromiseAll';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { promises as fs } from 'fs';
import path from 'path';
import TSON from 'typescript-json';

import coingeckoTokenList from './coingecko-coin-list.json';

const TRUSTWALLET_ASSETS_PATH = './assets/trustwallet-assets';
const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
const CORE_TOKEN_LISTS = {
  ETHEREUM: path.resolve(
    WORKSPACE_ROOT_PATH,
    './packages/bento-core/src/tokens/ethereum.json',
  ),
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

const fetchEthereumAssets = async () => {
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
  const tokens: ERC20TokenInput[] = (await safePromiseAll(tokensPromise))
    .flat()
    .flatMap((token) => {
      if (token.type !== 'ERC20') {
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
    await fs.readFile(CORE_TOKEN_LISTS.ETHEREUM, 'utf8'),
  ) as ERC20TokenInput[];
  const newTokens = tokens.reduce((acc, token) => {
    if (
      !acc.find((v) => v.address.toLowerCase() === token.address.toLowerCase())
    ) {
      acc.push(token);
    }
    return acc;
  }, previousTokens);

  await fs.writeFile(CORE_TOKEN_LISTS.ETHEREUM, stringify(newTokens), 'utf8');
};

const main = async () => {
  await fetchEthereumAssets();
};

main();
