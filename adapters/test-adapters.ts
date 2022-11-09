import findWorkspaceRoot from 'find-yarn-workspace-root';
import fs from 'fs';
import path from 'path';
import TSON from 'typescript-json';

import {
  BentoChainAdapter,
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from './_lib/types';

const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
const ADAPTER_ROOT_PATH = path.resolve(WORKSPACE_ROOT_PATH, './adapters');

type Child = {
  name: string;
  path: string;
};

const fetchChildren = (basePath: string): Child[] =>
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

const validateChildren = (
  children: Child[],
  adapterName: string,
  typeName: string,
  testModule: (module: unknown) => boolean,
  callback?: (child: Child) => void,
) => {
  for (const child of children) {
    const chainAdapterPath = path.join(child.path, 'index.ts');
    const hasIndex = fs.existsSync(chainAdapterPath);
    if (!hasIndex) {
      console.error(`❌ ${adapterName} ${child.name}: missing index.ts`);
    } else {
      let chainAdapter: any;
      let hasError: boolean = false;
      try {
        chainAdapter = require(chainAdapterPath);
      } catch (err) {
        const typedError = err as Error;
        console.error(
          `❌ ${adapterName} ${child.name}: failed to load index.ts`,
          typedError.message,
        );
        hasError = true;
      }

      if (!hasError) {
        if (!testModule(chainAdapter)) {
          console.error(
            `❌ ${adapterName} ${child.name}: not a valid \`${typeName}\``,
          );
        } else {
          console.log(`✅ ${adapterName}: ${child.name}`);
        }
      }
    }

    callback?.(child);
  }
};

const validateProtocols = (service: Child) => {
  const basePath = service.path;
  const protocols = fs.readdirSync(basePath).flatMap((filename) => {
    if (
      filename.startsWith('_') ||
      filename.startsWith('.') ||
      filename === 'dist' ||
      filename === 'index.ts' ||
      path.extname(filename) !== '.ts'
    ) {
      return [];
    }
    const adapterPath = path.join(basePath, filename);
    if (fs.statSync(path.join(basePath, filename)).isDirectory()) {
      const protocolAdapterPath = path.join(adapterPath, 'index.ts');
      const hasIndex = fs.existsSync(protocolAdapterPath);
      if (!hasIndex) {
        return [];
      }
      return { name: filename, path: adapterPath };
    }
    return { name: filename, path: adapterPath };
  });

  for (const protocol of protocols) {
    const protocolAdapterPath = protocol.path;
    let protocolAdapter: any;
    let hasError: boolean = false;
    try {
      protocolAdapter = require(protocolAdapterPath);
    } catch (err) {
      const typedError = err as Error;
      console.error(
        `❌   ㄴ Protocol: ${service.name}/${protocol.name}: failed to load protocol adapter`,
        typedError.message,
      );
      hasError = true;
    }

    if (!hasError) {
      if (!TSON.is<BentoProtocolAdapter>(protocolAdapter)) {
        console.error(
          `❌   ㄴ Protocol: ${service.name}/${protocol.name}: not a valid \`BentoProtocolAdapter\``,
        );
      } else {
        console.log(`✅   ㄴ Protocol: ${protocol.name}`);
      }
    }
  }
};

const main = () => {
  const chains = fetchChildren(ADAPTER_ROOT_PATH);
  validateChildren(
    chains,
    'Chain',
    'BentoChainAdapter',
    (module: unknown) => TSON.is<BentoChainAdapter>(module),
    (chain) => {
      const services = fetchChildren(chain.path);
      validateChildren(
        services,
        'ㄴ Service',
        'BentoServiceAdapter',
        (module: unknown) => TSON.is<BentoServiceAdapter>(module),
        (service) => {
          validateProtocols(service);
        },
      );
    },
  );
};

main();
