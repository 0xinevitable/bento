import { type BentoChainAdapter } from '@bento/adapters';
import {
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from '@bento/adapters/_lib/types';
import { safeAsyncFlatMap } from '@bento/common';
import { Bech32Address } from '@bento/core';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import fsSync, { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';

import { withCORS } from '@/utils/middlewares/withCORS';

interface APIRequest extends NextApiRequest {
  query: {
    network?: string;
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
const fetchServiceAdapters = async (networkName: string) => {
  const basePath = path.resolve(
    WORKSPACE_ROOT_PATH,
    `./adapters/${networkName}`,
  );
  const files = await fs.readdir(basePath);

  let modules: Record<
    string,
    { info: BentoServiceAdapter; protocols: BentoProtocolAdapter[] }[]
  > = {};

  await Promise.all(
    files.map(async (serviceFileName) => {
      if (
        serviceFileName.startsWith('_') ||
        serviceFileName.startsWith('.') ||
        serviceFileName === 'dist'
      ) {
        return;
      }
      const adapterPath = path.join(basePath, serviceFileName);
      const stat = await fs.stat(adapterPath);
      if (!stat.isDirectory()) {
        return;
      }
      console.log(
        `@bento/adapters/dist/${networkName}/${serviceFileName}/index`,
      );
      const module: BentoServiceAdapter =
        await require(`@bento/adapters/dist/${networkName}/${serviceFileName}/index`);

      // protocols
      const files = await fs.readdir(adapterPath);
      const protocolModules = await safeAsyncFlatMap(
        files,
        async (filename) => {
          console.log(filename);
          if (
            filename.startsWith('_') ||
            filename.startsWith('.') ||
            filename === 'dist' ||
            filename === 'index.ts' ||
            path.extname(filename) !== '.ts'
          ) {
            return [];
          }

          const protocolAdapterPath = path.join(adapterPath, filename);
          console.log({ protocolAdapterPath });
          const stat = await fs.stat(protocolAdapterPath);
          if (stat.isDirectory()) {
            const hasIndex = fsSync.existsSync(protocolAdapterPath);
            if (!hasIndex) {
              return [];
            }
          }

          const moduleName = `@bento/adapters/dist/${networkName}/${serviceFileName}/${filename.replace(
            '.ts',
            '.js',
          )}`;
          console.log({ moduleName });
          try {
            const module = await require(moduleName);
            console.log({ module });
            return module;
          } catch (err) {
            console.error(err);
            return [];
          }
        },
      );

      console.log({ protocolModules });
      if (modules[networkName]) {
        modules[networkName].push({ info: module, protocols: protocolModules });
      } else {
        modules[networkName] = [{ info: module, protocols: protocolModules }];
      }
    }),
  );

  return modules;
};

const handler = async (req: APIRequest, res: NextApiResponse) => {
  const wallets = parseWallets(req.query.walletAddress ?? '');
  const network = (req.query.network ?? '').toLowerCase();

  const [chainAdapters, serviceAdaptersInChain] = await Promise.all([
    fetchChainAdapters(),
    fetchServiceAdapters(network),
  ]);
  const chain = chainAdapters[network];

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

    console.log(serviceAdaptersInChain);

    try {
      return [];
      // const balances = await chain.getAccount(account);
      // return balances.map((v) => ({ account, ...v }));
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  res.status(200).json(result);
};

export default withCORS(handler);
