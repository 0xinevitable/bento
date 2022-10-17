import { safePromiseAll } from '@bento/common';
import { Bech32Address } from '@bento/core';
import { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';

import { IONDAO } from '@/defi/osmosis/ion-dao';
import { Osmosis } from '@/defi/osmosis/osmosis';
import {
  DeFiStaking,
  OsmosisDeFiProtocolType,
  OsmosisDeFiType,
} from '@/defi/types/staking';
import { withCached } from '@/defi/utils/cache';

interface APIRequest extends NextApiRequest {
  query: {
    walletAddress?: string;
  };
}

const parseWallets = (mixedQuery: string) => {
  const query = mixedQuery.toLowerCase();
  if (query.indexOf(',') === -1) {
    return [query];
  }
  return query.split(',');
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');

  // TODO: Enumerate for all wallets
  const walletAddress = Bech32Address.fromBech32(wallets[0]).toBech32('osmo');

  const redisClient = createRedisClient();
  await redisClient.connect();

  const getIONStakes = withCached(
    `defis:${OsmosisDeFiProtocolType.ION}:${walletAddress}`,
    redisClient,
    async (walletAddress: string) =>
      IONDAO.getGovernanceStake(walletAddress).then((st) => [st]),
  );
  const getOsmosisGAMMLPs = withCached(
    `defis:${OsmosisDeFiType.OSMOSIS_GAMM_LP}:${walletAddress}`,
    redisClient,
    Osmosis.getGAMMLPs,
  );

  let stakings: DeFiStaking[] = [];

  stakings = (
    await safePromiseAll([
      getIONStakes(walletAddress)
        .then((r) => r.data)
        .catch((err) => {
          console.error(err);
          return [];
        }),
      getOsmosisGAMMLPs(walletAddress)
        .then((r) => r.data)
        .catch((err) => {
          console.error(err);
          return [];
        }),
    ])
  ).flat();

  // stakings = stakings.filter(withoutEmptyDeFiStaking);

  res.status(200).json(stakings);
};

export default handler;
