import { adapters, type BentoSupportedNetwork } from '@bento/adapters';
import {
  ProtocolAccountInfo,
  ProtocolInfo,
  ServiceInfo,
} from '@bento/adapters/_lib/types';
import { safeAsyncFlatMap, safePromiseAll } from '@bento/common';
import { Bech32Address } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createRedisClient } from '@/utils/Redis';
import { withRedisCached } from '@/utils/cache';
import { withoutEmptyProtocolAccounts } from '@/utils/filters';
import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    network?: string;
    walletAddress?: string;
  };
}

type APIResponse = (ServiceInfo & {
  serviceId: string;
  chain: BentoSupportedNetwork;
  protocols: {
    protocolId: string;
    info: ProtocolInfo;
    accounts: ProtocolAccountInfo[];
  }[];
})[];

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

  const chainAdapter = await adapter.chain;
  const chain = chainAdapter.default;
  const chainName = chain.name;

  const services: APIResponse = await safeAsyncFlatMap(
    Object.entries(adapter.services),
    async ([serviceId, service]) => {
      const info = (await service.info).default;

      const protocols = await safeAsyncFlatMap(
        Object.entries(service.protocols),
        async ([protocolId, protocolResolver]) => {
          const protocol = await protocolResolver;
          const info = protocol.default;

          let accounts = await safeAsyncFlatMap(wallets, async (wallet) => {
            let account = wallet;

            if (chain.type === 'cosmos-sdk') {
              // chainBech32Address
              const bech32Address = Bech32Address.fromBech32(account);
              account = bech32Address.toBech32(chain.bech32Config.prefix);
            }

            let getAccountParams: Parameters<typeof protocol.getAccount> = [
              account,
            ];

            if (!!info.conditional) {
              // FIXME: Cache in local after first call to Redis
              const getChainBalances = withRedisCached(
                `balances:${chainName}:${account}`,
                chainAdapter.getAccount,
                { redisClient, defaultValue: [] },
              );
              const { data: balances } = await getChainBalances(account);
              if (!!info.conditional?.hasToken) {
                const token = balances.find(
                  (token) => token.ind === info.conditional?.hasToken,
                );
                getAccountParams.push(token?.balance || 0);
              } else if (info.conditional.passAllBalances) {
                const balancesMap = balances.reduce(
                  (acc, token) => ({
                    ...acc,
                    [token.ind]: token.balance,
                  }),
                  {},
                );
                getAccountParams.push(balancesMap);
              }
            }

            const getAccount = withRedisCached(
              `protocol:${chain.name}:${serviceId}:${protocolId}:${account}`,
              protocol.getAccount,
              { redisClient, defaultValue: [] },
            );
            const { data: accountInfo } = await getAccount(...getAccountParams);
            return accountInfo.flatMap((v) => ({ account, ...v }));
          });
          accounts = accounts.filter(withoutEmptyProtocolAccounts);

          if (!accounts.length) {
            return [];
          }

          return {
            protocolId,
            info,
            accounts: accounts.filter(withoutEmptyProtocolAccounts),
          };
        },
      );

      if (!protocols.length) {
        return [];
      }

      return {
        serviceId,
        chain: network,
        ...info,
        protocols,
      };
    },
  );

  await redisClient.disconnect();

  res.status(200).json(services);
};

export default withCORS(handler);
