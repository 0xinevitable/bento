import { safePromiseAll } from '@bento/common';
import { TokenInput } from '@bento/core/lib/tokens';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import coingeckoTokenList from './coingecko-coin-list.json';
import { WORKSPACE_ROOT_PATH, stringify } from './config';

const CHAIN_OUTPUT_PATH = path.resolve(
  WORKSPACE_ROOT_PATH,
  './packages/bento-core/tokens/klaytn.json',
);

const downloadImage = (url: string, imagePath: string) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    (response) =>
      new Promise<void>((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(imagePath))
          .on('finish', () => resolve())
          .on('error', (e: Error) => reject(e));
      }),
  );

export const update = async () => {
  const tokenInfoFromKLAYswap = await getKLAYswapTokenInfo();
  const previousTokens = JSON.parse(
    await fs.promises.readFile(CHAIN_OUTPUT_PATH, 'utf8'),
  ) as TokenInput[];

  const tokens: TokenInput[] = await safePromiseAll(
    tokenInfoFromKLAYswap.map(async (token) => {
      const coinGeckoToken = coingeckoTokenList.find(
        (v) =>
          v.platforms['klay-token']?.toLowerCase() ===
          token.address.toLowerCase(),
      );
      let name: string = coinGeckoToken?.name ?? token.name;

      const prevData = previousTokens.find((v) => v.address === token.address);

      const ICON_OUTPUT_PATH = path.resolve(
        WORKSPACE_ROOT_PATH,
        `./packages/bento-web/public/assets/icons/klaytn/${token.address}.png`,
      );

      const iconRemoteURL = `https://s.klayswap.com/data/img/token/${token.address}/icon.png`;
      let iconURL:
        | string
        | undefined = `/assets/icons/klaytn/${token.address}.png`;

      try {
        await downloadImage(iconRemoteURL, ICON_OUTPUT_PATH);
      } catch (err) {
        console.log(
          `[Warning] Failed to download image for ${token.address} (${name})`,
        );
        if (prevData?.logo) {
          iconURL = prevData.logo;
          console.log(`[Info] Fallback to previous image: ${iconURL}`);
        } else {
          iconURL = undefined;
        }
      }

      let coinGeckoTokenId: string | undefined = coinGeckoToken?.id;
      if (!coinGeckoTokenId) {
        console.log(
          `[Warning] No coingecko token found for ${token.address} (${name})`,
        );
        if (prevData?.coinGeckoId) {
          coinGeckoTokenId = prevData.coinGeckoId;
          console.log(
            `[Info] Fallback to previous coinGeckoId: ${coinGeckoTokenId}`,
          );
        } else {
          coinGeckoTokenId = undefined;
        }
      }

      return {
        symbol: token.symbol,
        name,
        decimals: token.decimal,
        address: token.address,
        coinGeckoId: coinGeckoToken?.id,
        logo: iconURL,
      };
    }),
  );

  console.log(JSON.stringify(tokens));

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

  await fs.promises.writeFile(
    CHAIN_OUTPUT_PATH,
    prettier.format(stringify(newTokens), { parser: 'json' }),
    'utf8',
  );
};

const getKLAYswapTokenInfo = async () => {
  const { data: rawTokens } = await axios.get<any[]>(
    'https://s.klayswap.com/stat/tokenInfo.min.json',
  );

  const fields = rawTokens[0] as string[];
  const tokens = rawTokens.slice(1).flatMap((token) => {
    let tokenObj: any = {};
    fields.forEach((field, index) => {
      tokenObj[field] = token[index];
    });

    if (tokenObj.address === '0x0000000000000000000000000000000000000000') {
      return [];
    }

    return {
      ...tokenObj,
      address: tokenObj.address.toLowerCase(),
    } as KLAYswapTokenInfo;
  });

  return tokens;
};
type KLAYswapTokenInfo = {
  id: number;
  address: string;
  symbol: string;
  name: string;
  chain: 'KLAYTN';
  decimal: number;
  img: string;
  grade: string;
  contractGrade: string;
  isDrops: true;
  isStable: false;
  amount: string;
  volume: string;
  oraclePrice: string;
  price: string;
};
