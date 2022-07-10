import { Base64 } from '@bento/common';
import { TokenInput } from '@bento/core/lib/tokens';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';

import coingeckoTokenList from './coingecko-coin-list.json';
import { WORKSPACE_ROOT_PATH, stringify } from './config';

const MANUALLY_OVERRIDED_IDS = [
  ['0x574e9c26bda8b95d7329505b4657103710eb32ea', 'binancecoin'],
  ['0xb40178be0fcf89d0051682e5512a8bab56b9ec3e', 'rai-finance'],
  ['0x9eaefb09fe4aabfbe6b1ca316a3c36afc83a393f', 'ripple'],
  ['0xcee8faf64bb97a73bb51e115aa89c17ffa8dd167', 'tether'],
  ['0x02cbe46fb8a1f579254a9b485788f2d86cad51aa', 'bora'],
];

export const update = async () => {
  const DEXATA_DATA_FILE_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './scripts/assets/raw/dexata.txt',
  );
  let data = await fs.readFile(DEXATA_DATA_FILE_PATH, 'utf8');
  let t = '',
    n = data.length;
  const klaytnTokens: {
    n: string;
    a: string;
    s: string;
    d: number;
    p: number;
    p24: number;
    v: number;
    ut: number;
  }[] =
    ((t =
      n <= 200
        ? data.split('').reverse().join('')
        : `${data.substring(n - 100, n)}${data.substring(
            100,
            n - 100,
          )}${data.substring(0, 100)}`
            .split('')
            .reverse()
            .join('')),
    JSON.parse(decodeURIComponent(Base64.decode(t).replace(/\+/gi, '%20'))));
  // console.log(klaytnTokens, klaytnTokens.length);

  const tokens: TokenInput[] = klaytnTokens.flatMap((minToken) => {
    const token = {
      name: minToken.n,
      symbol: minToken.s,
      address: minToken.a,
      decimals: minToken.d,
    };
    if (token.address === '0x0000000000000000000000000000000000000000') {
      return [];
    }

    let wrappedAssetName: string = '';
    let wrappedAssetSymbol: string = '';
    let sp = token.name.split('Orbit Bridge Klaytn ');
    if (sp.length === 2) {
      wrappedAssetName = sp[1].split(' ')[0];
      wrappedAssetSymbol =
        token.symbol.split('o')[1] ?? token.symbol.split('K')[1] ?? '';
    } else {
      sp = token.name.split('Wrapped ');
      if (sp.length === 2) {
        wrappedAssetName = sp[1];
        wrappedAssetSymbol = token.symbol;
      }
    }
    let coinGeckoToken = coingeckoTokenList.find(
      (v) =>
        v.platforms['klay-token']?.toLowerCase() ===
        token.address.toLowerCase(),
    );

    MANUALLY_OVERRIDED_IDS.forEach(([addr, id]) => {
      if (token.address === addr) {
        coinGeckoToken = coingeckoTokenList.find((v) => v.id === id);
      }
    });

    if (!coinGeckoToken && !!wrappedAssetName) {
      coinGeckoToken = coingeckoTokenList.find(
        (v) =>
          v.name.toLowerCase().includes(wrappedAssetName.toLowerCase()) &&
          v.symbol.toLowerCase() === wrappedAssetSymbol.toLowerCase(),
      );
      if (!coinGeckoToken && !!wrappedAssetSymbol) {
        coinGeckoToken = coingeckoTokenList.find(
          (v) => v.symbol.toLowerCase() === wrappedAssetSymbol.toLowerCase(),
        );
      }
    }

    if (!!coinGeckoToken && !coinGeckoToken.platforms?.['klay-token']) {
      console.log(token, coinGeckoToken);
    }

    let tokenName = token.name;
    if (token.address === '0xd676e57ca65b827feb112ad81ff738e7b6c1048d') {
      tokenName = 'Kronos DAO';
    }

    return {
      symbol: token.symbol.replace('$', ''),
      name: tokenName,
      decimals: token.decimals,
      address: token.address,
      coinGeckoId: coinGeckoToken?.id,
      // logo: token.logoURI,
    };
  });
  // console.log(tokens, tokens.length);

  const CHAIN_OUTPUT_PATH = path.resolve(
    WORKSPACE_ROOT_PATH,
    './packages/bento-core/src/tokens/klaytn.json',
  );
  let previousTokens: TokenInput[] = [];
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
