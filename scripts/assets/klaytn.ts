import { safePromiseAll } from '@bento/common';
import { EEEE_ADDRESS, TokenInput, ZERO_ADDRESS } from '@bento/core';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import coingeckoTokenList from './coingecko-coin-list.json';
import { WORKSPACE_ROOT_PATH, stringify } from './config';

const CHAIN_OUTPUT_PATH = path.resolve(
  WORKSPACE_ROOT_PATH,
  './packages/core/tokens/klaytn.json',
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
  const tokenInfoFromKokonutSwap = await getKokonutSwapTokenInfo();
  const addrs = [
    ...tokenInfoFromKokonutSwap.map((v) => v.address),
    ...tokenInfoFromKLAYswap.map((v) => v.address),
  ];

  const previousTokens = JSON.parse(
    await fs.promises.readFile(CHAIN_OUTPUT_PATH, 'utf8'),
  ) as TokenInput[];

  const tokens: TokenInput[] = await safePromiseAll(
    addrs.map(async (address) => {
      const tokenFromKLAYswap = tokenInfoFromKLAYswap.find(
        (v) => v.address === address,
      );
      const tokenFromKokonutSwap = tokenInfoFromKokonutSwap.find(
        (v) => v.address === address,
      );
      const token = tokenFromKokonutSwap || tokenFromKLAYswap!;
      const coinGeckoToken = coingeckoTokenList.find(
        (v) =>
          v.platforms['klay-token']?.toLowerCase() ===
          token.address.toLowerCase(),
      );
      let name: string = coinGeckoToken?.name ?? token.name;

      const prevData = previousTokens.find((v) => v.address === token.address);

      const ICON_OUTPUT_PATH = path.resolve(
        WORKSPACE_ROOT_PATH,
        `./apps/web/public/assets/icons/klaytn/${token.address}.png`,
      );

      const iconRemoteURL = !!tokenFromKokonutSwap?.iconPath
        ? `https://kokonutswap.finance${tokenFromKokonutSwap.iconPath}`
        : `https://s.klayswap.com/data/img/token/${token.address}/icon.png`;
      let iconURL:
        | string
        | undefined = `/assets/icons/klaytn/${token.address}.png`;

      try {
        if (!fs.existsSync(ICON_OUTPUT_PATH)) {
          await downloadImage(iconRemoteURL, ICON_OUTPUT_PATH);
        } else {
          console.log(
            `[Info] Image exists. Passing... ${token.address} (${name}) / ${iconRemoteURL}`,
          );
        }
      } catch (err) {
        console.log(
          `[Warning] Failed to download image for ${token.address} (${name}) / ${iconRemoteURL}`,
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

  let newTokens = tokens.reduce((acc, token) => {
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

    if (tokenObj.address === ZERO_ADDRESS) {
      return [];
    }

    return {
      ...tokenObj,
      address: tokenObj.address.toLowerCase(),
    } as KLAYswapTokenInfo;
  });

  return tokens;
};

const getKokonutSwapTokenInfo = async () => {
  const {
    data: { coins: tokens },
  } = await axios.get<KokonutSwapCoinsResponse>(
    'https://prod.kokonut-api.com/coins',
  );

  return tokens.flatMap((token) => {
    const address = token.address.toLowerCase();
    if (token.isLpToken || !token.isSwapAvailable || address === EEEE_ADDRESS) {
      return [];
    }
    return { ...token, address };
  });
};
type KokonutSwapCoinsResponse = {
  coins: {
    address: string;
    symbol: string;
    name: string;
    decimal: number;
    isLpToken: boolean;
    isSwapAvailable: boolean;
    iconPath: string;
  }[];
};
