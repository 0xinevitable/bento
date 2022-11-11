import { adapters } from '@bento/adapters';
import {
  ChainType,
  CosmosSDKBasedNetworks,
  safeAsyncFlatMap,
} from '@bento/common';
import { Bech32Address } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

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
  ).toLowerCase() as CosmosSDKBasedNetworks;

  const adapter = adapters[network]?.chain;
  if (!adapter) {
    res.status(400).json({
      error: `Network ${network} is not supported`,
    });
    return;
  }

  const result = await safeAsyncFlatMap(wallets, async (walletAddress) => {
    let account = walletAddress;
    const bech32Address = Bech32Address.fromBech32(walletAddress);

    if (adapter.default.type === 'cosmos-sdk') {
      // chainBech32Address
      account = bech32Address.toBech32(adapter.default.bech32Config.prefix);
    }

    try {
      const balances = await adapter.getAccount(account);
      return balances.map((v) => ({ account, ...v }));
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  res.status(200).json(result);
};

export default withCORS(handler);
