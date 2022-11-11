import { adapters, type BentoSupportedNetwork } from '@bento/adapters';
import { safeAsyncFlatMap, safePromiseAll } from '@bento/common';
import { Bech32Address } from '@bento/core';
import type { NextApiRequest, NextApiResponse } from 'next';

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

  const chain = (await adapter.chain).default;
  const services = await safePromiseAll(
    Object.values(adapter.services).map(async (service) => {
      const info = service.info.default;
      const protocols = await safePromiseAll(
        Object.values(service.protocols).map(async (protocol) => {
          const info = protocol.default;
          const accounts = await safeAsyncFlatMap(wallets, async (wallet) => {
            let account = wallet;

            if (chain.type === 'cosmos-sdk') {
              // chainBech32Address
              const bech32Address = Bech32Address.fromBech32(account);
              account = bech32Address.toBech32(chain.bech32Config.prefix);
            }

            const accountInfo = await protocol.getAccount(account);
            return accountInfo.flatMap((v) => ({ account, ...v }));
          });

          return { info, accounts };
        }),
      );
      return { ...info, protocols };
    }),
  );

  res.status(200).json(services);
};

export default withCORS(handler);
