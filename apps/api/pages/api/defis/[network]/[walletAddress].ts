import { adapters, type BentoSupportedNetwork } from '@bento/adapters';
import { safeAsyncFlatMap, safePromiseAll } from '@bento/common';
import { Bech32Address } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';
import { withCached } from '@/utils/cache';
import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    network?: string;
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

  const adapter = adapters[network];
  if (!adapter) {
    res.status(400).json({
      error: `Network ${network} is not supported`,
    });
    return;
  }

  const redisClient = createRedisClient();
  await redisClient.connect();

  const chain = (await adapter.chain).default;
  const services = await safePromiseAll(
    Object.entries(adapter.services).map(async ([serviceId, service]) => {
      const info = service.info.default;

      const protocols = await safePromiseAll(
        Object.entries(service.protocols).map(
          async ([protocolId, protocol]) => {
            const info = protocol.default;
            const accounts = await safeAsyncFlatMap(wallets, async (wallet) => {
              let account = wallet;

              if (chain.type === 'cosmos-sdk') {
                // chainBech32Address
                const bech32Address = Bech32Address.fromBech32(account);
                account = bech32Address.toBech32(chain.bech32Config.prefix);
              }

              const getAccount = withCached(
                `protocol:${chain.name}:${serviceId}:${protocolId}:${account}`,
                protocol.getAccount,
                { redisClient, defaultValue: [] },
              );
              const { data: accountInfo } = await getAccount(account);
              return accountInfo.flatMap((v) => ({ account, ...v }));
            });

            return { info, accounts };
          },
        ),
      );
      return { ...info, protocols };
    }),
  );

  await redisClient.disconnect();

  res.status(200).json(services);
};

export default withCORS(handler);
