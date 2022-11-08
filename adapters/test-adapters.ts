import findWorkspaceRoot from 'find-yarn-workspace-root';
import fs from 'fs';
import path from 'path';
import TSON from 'typescript-json';

import { BentoChainAdapter } from './_lib/types';

const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
const ADAPTER_ROOT_PATH = path.resolve(WORKSPACE_ROOT_PATH, './adapters');

const fetchChildren = (basePath: string) =>
  fs.readdirSync(basePath).flatMap((filename) => {
    if (
      filename.startsWith('_') ||
      filename.startsWith('.') ||
      filename === 'dist'
    ) {
      return [];
    }
    const adapterPath = path.join(basePath, filename);
    if (fs.statSync(path.join(basePath, filename)).isDirectory()) {
      return { name: filename, path: adapterPath };
    }
    return [];
  });

const chains = fetchChildren(ADAPTER_ROOT_PATH);
for (const chain of chains) {
  const chainAdapterPath = path.join(chain.path, 'index.ts');
  const hasIndex = fs.existsSync(chainAdapterPath);
  if (!hasIndex) {
    console.error(`❌ Chain ${chain.name}: missing index.ts`);
  } else {
    const chainAdapter = require(chainAdapterPath);
    if (!TSON.is<BentoChainAdapter>(chainAdapter)) {
      console.error(
        `❌ Chain ${chain.name}: not a valid \`BentoChainAdapter\``,
      );
    } else {
      console.log(`✅ Chain: ${chain.name}`);
    }
  }

  const services = fetchChildren(chain.path);
  for (const service of services) {
    const serviceAdapterPath = path.join(service.path, 'index.ts');
    const hasIndex = fs.existsSync(serviceAdapterPath);
    if (!hasIndex) {
      console.error(
        `❌ Service ${chain.name}/${service.name}: missing index.ts`,
      );
    }
  }
}
