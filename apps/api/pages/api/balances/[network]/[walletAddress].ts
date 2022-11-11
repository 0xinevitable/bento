import { adapters, type BentoSupportedNetwork } from '@bento/adapters';
import {
  ChainType,
  CosmosSDKBasedNetworks,
  safeAsyncFlatMap,
} from '@bento/common';
import { Bech32Address } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';
import { withRedisCached } from '@/utils/cache';
import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    type: ChainType;
    network?: CosmosSDKBasedNetworks;
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
  const network = (
    req.query.network ?? ''
  ).toLowerCase() as BentoSupportedNetwork;

  const adapter = await adapters[network]?.chain;
  if (!adapter) {
    res.status(400).json({
      error: `Network ${network} is not supported`,
    });
    return;
  }

  const redisClient = createRedisClient();
  await redisClient.connect();

  const chainName = adapter.default.name;

  const result = await safeAsyncFlatMap(wallets, async (walletAddress) => {
    let account = walletAddress;

    if (adapter.default.type === 'cosmos-sdk') {
      // chainBech32Address
      const bech32Address = Bech32Address.fromBech32(walletAddress);
      account = bech32Address.toBech32(adapter.default.bech32Config.prefix);
    }

    try {
      const getAccount = withRedisCached(
        `balances:${chainName}:${account}`,
        adapter.getAccount,
        { redisClient, defaultValue: [] },
      );
      const { data: balances } = await getAccount(account);
      return balances.map((v) => ({ account, ...v }));
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  await redisClient.disconnect();

  res.status(200).json(result);
};

export default withCORS(handler);
