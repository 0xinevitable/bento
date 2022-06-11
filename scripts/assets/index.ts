import { ERC20TokenInput } from '@bento/core/lib/tokens';
import { safePromiseAll } from '@bento/core/lib/utils/safePromiseAll';
import { promises as fs } from 'fs';
import path from 'path';

import coingeckoTokenList from './coingecko-coin-list.json';

const TRUSTWALLET_ASSETS_PATH = './assets/trustwallet-assets';

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
  console.log(tokens);
};

const main = async () => {
  await fetchEthereumAssets();
};

main();
