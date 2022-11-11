import fs from 'fs';
import path from 'path';
import TSON from 'typescript-json';

import { ADAPTER_ROOT_PATH, Child, fetchChildren } from '../_lib/scripts/utils';
import {
  BentoChainAdapter,
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from '../_lib/types';

const onlyIndex = (filename: string) =>
  !(
    filename.startsWith('_') ||
    filename.startsWith('.') ||
    filename === 'dist'
  );

const validateChildren = async (
  children: Child[],
  adapterName: string,
  typeName: string,
  testModule: (module: unknown) => boolean,
  callback?: (
    child: Child,
    module: BentoChainAdapter | null | undefined,
  ) => Promise<void>,
) => {
  for (const child of children) {
    const chainAdapterPath = path.join(child.path, 'index.ts');
    const hasIndex = fs.existsSync(chainAdapterPath);
    let chainAdapter: any;

    if (!hasIndex) {
      console.error(`❌ ${adapterName} ${child.name}: missing index.ts`);
    } else {
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

    await callback?.(child, chainAdapter);
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
        console.log(`✅   ㄴ Protocol: ${service.name}/${protocol.name}`);
      }
    }
  }
};

const main = async () => {
  const chains = await fetchChildren(ADAPTER_ROOT_PATH, onlyIndex);
  await validateChildren(
    chains,
    'Chain',
    'BentoChainAdapter',
    (module: unknown) => TSON.is<BentoChainAdapter>(module),
    async (chain, module) => {
      if (!!module && !!module.TEST_ADDRESS) {
        try {
          const accountInfo = await module.getAccount(module.TEST_ADDRESS);
          console.log(
            '🚀 - account info fetched',
            JSON.stringify(accountInfo).slice(0, 45) + '...',
          );
        } catch (err) {
          const typedError = err as Error;
          console.error(
            `❌ - failed to fetch account info:`,
            typedError.message || 'unknown error',
          );
        }
      }

      const services = await fetchChildren(chain.path, onlyIndex);
      validateChildren(
        services,
        'ㄴ Service',
        'BentoServiceAdapter',
        (module: unknown) => TSON.is<BentoServiceAdapter>(module),
        async (service) => {
          validateProtocols(service);
        },
      );
    },
  );
};

main();
