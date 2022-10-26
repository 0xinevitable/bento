import { TokenInput } from '@bento/core';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

import { WORKSPACE_ROOT_PATH, stringify } from './config';
import OSMOSIS_ASSETLIST from './raw/osmosis-1.json';

const CHAIN_OUTPUT_PATH = path.resolve(
  WORKSPACE_ROOT_PATH,
  './packages/core/tokens/osmosis.json',
);

export const update = async () => {
  const tokens: TokenInput[] = OSMOSIS_ASSETLIST.assets.map((asset) => {
    const denomUnits = asset.denom_units;
    const decimals =
      denomUnits.find(
        (v) => v.denom.toLowerCase() === asset.display.toLowerCase(),
      )?.exponent ?? 0;

    return {
      symbol: asset.symbol,
      name: asset.symbol,
      decimals,
      address: asset.address || asset.base,
      coinGeckoId: asset.coingecko_id,
      logo: asset.logo_URIs.png || asset.logo_URIs.svg,
      denomUnits: denomUnits,
    };
  });

  await fs.promises.writeFile(
    CHAIN_OUTPUT_PATH,
    prettier.format(stringify(tokens), { parser: 'json' }),
    'utf8',
  );
};
