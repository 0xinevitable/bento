import { Bech32Address } from '@bento/core';
import { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';

import { withoutEmptyDeFiStaking } from '@/defi/klaytn/utils/withoutEmptyDeFiStaking';
import { IONDAO } from '@/defi/osmosis/ion-dao';
import { getGAMMLPs } from '@/defi/osmosis/osmosis';
import { DeFiStaking, OsmosisDeFiProtocolType } from '@/defi/types/staking';
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

  // const redisClient = createRedisClient();
  // await redisClient.connect();

  let stakings: DeFiStaking[] = [];
  // const IONFetcher = await withCached(
  //   `defis:${OsmosisDeFiProtocolType.ION}:${walletAddress}`,
  //   redisClient,
  //   async (walletAddress: string) =>
  //     IONDAO.getGovernanceStake(walletAddress).then((st) => [st]),
  // );
  // return IONFetcher(walletAddress);
  stakings = await getGAMMLPs(walletAddress);
  // stakings = stakings.filter(withoutEmptyDeFiStaking);

  res.status(200).json(stakings);
};

export default handler;

// const getDeFiStakingsByWalletAddress = async (
//   walletAddress: string,
// ): Promise<DeFiStaking[]> => {
//   const staking = await IONDAO.getGovernanceStake(walletAddress);
//   return [staking];
// };
