import { type BentoChainAdapter } from '@bento/adapters';
import {
  ChainType,
  CosmosSDKBasedNetworks,
  safeAsyncFlatMap,
} from '@bento/common';
import { Bech32Address } from '@bento/core';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    type: ChainType;
    network?: CosmosSDKBasedNetworks;
    walletAddress?: string;
  };
}

const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';

const parseWallets = (mixedQuery: string) => {
  const query = mixedQuery.toLowerCase();
  if (query.indexOf(',') === -1) {
    return [query];
  }
  return query.split(',');
};

const ADAPTER_ROOT_PATH = path.resolve(WORKSPACE_ROOT_PATH, './adapters');
const fetchChainAdapters = async () => {
  const files = await fs.readdir(ADAPTER_ROOT_PATH);

  let modules: Record<string, BentoChainAdapter> = {};

  await Promise.all(
    files.map(async (filename) => {
      if (
        filename.startsWith('_') ||
        filename.startsWith('.') ||
        filename === 'dist'
      ) {
        return;
      }
      const adapterPath = path.join(ADAPTER_ROOT_PATH, filename);
      const stat = await fs.stat(adapterPath);
      if (!stat.isDirectory()) {
        return;
      }
      const module = await require(`@bento/adapters/dist/${filename}/index`);
      modules[filename] = module as BentoChainAdapter;
    }),
  );

  return modules;
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');
  const network = (
    req.query.network ?? ''
  ).toLowerCase() as CosmosSDKBasedNetworks;

  const chainAdapters = await fetchChainAdapters();

  const result = await safeAsyncFlatMap(wallets, async (walletAddress) => {
    let account = walletAddress;
    const bech32Address = Bech32Address.fromBech32(walletAddress);
    let chain = chainAdapters[network];

    if (chain.default.type === 'cosmos-sdk') {
      // chainBech32Address
      account = bech32Address.toBech32(chain.default.bech32Config.prefix);
    }

    if (!chain) {
      return [];
    }

    try {
      const balances = await chain.getAccount(account);
      return balances.map((v) => ({ account, ...v }));
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  res.status(200).json(result);
};

export default withCORS(handler);
