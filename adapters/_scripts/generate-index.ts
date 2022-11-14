import { safePromiseAll } from '@bento/common';
import dedent from 'dedent';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';

import {
  ADAPTER_ROOT_PATH,
  WORKSPACE_ROOT_PATH,
  fetchChildren,
} from '../_lib/scripts/utils';

const INDEX_OUTPUT_PATH = path.join(ADAPTER_ROOT_PATH, './index.ts');

const onlyIndex = (filename: string) =>
  !filename.startsWith('_') && !filename.startsWith('.') && filename !== 'dist';
const onlyAdapters = (filename: string) =>
  !filename.startsWith('_') &&
  !filename.startsWith('.') &&
  filename !== 'dist' &&
  filename !== 'index.ts' &&
  path.extname(filename) === '.ts';

const main = async () => {
  const chains = await fetchChildren(ADAPTER_ROOT_PATH, onlyIndex);
  let chainNameUnion = chains.map((v) => `'${v.name}'`).join(' | ');

  let chainsWithServices: string[] = [];
  const chainScripts = await safePromiseAll(
    chains.map(async (chain) => {
      const services = await fetchChildren(chain.path, onlyIndex);
      if (services.length > 0) {
        chainsWithServices.push(chain.name);
      }

      const serviceScripts = await safePromiseAll(
        services.map(async (service) => {
          const protocols = await fetchChildren(
            service.path,
            onlyAdapters,
            false,
          );
          return dedent`
            '${service.name}': {
              info: require('./${chain.name}/${service.name}'),
              protocols: {
                ${protocols
                  .map(
                    (v) =>
                      `'${v.name}': require('./${chain.name}/${service.name}/${v.name}')`,
                  )
                  .join(',')}
              }
            }
          `;
        }),
      );

      return dedent`
        '${chain.name}': {
          chain: require('./${chain.name}'),
          services: {
            ${serviceScripts.join(',')}
          }
        }
      `;
    }),
  );

  chainsWithServices = chainsWithServices.sort();

  const content = dedent`
import {
  BentoChainAdapter,
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from './_lib/types';

export type { BentoChainAdapter, BentoProtocolAdapter, BentoServiceAdapter };
export { type CosmosSDKBasedChain } from './_lib/types/cosmos-sdk';

export type BentoSupportedNetwork = ${chainNameUnion};

export const BentoDeFiSupportedNetworks: BentoSupportedNetwork[] = ${JSON.stringify(
    chainsWithServices,
  )};

type Adapters = Record<
  BentoSupportedNetwork,
  {
    chain: Promise<BentoChainAdapter>;
    services: Record<
      string,
      {
        info: Promise<BentoServiceAdapter>;
        protocols: Record<string, Promise<BentoProtocolAdapter>>;
      }
    >;
  }
>;

export const adapters: Adapters = {
  ${chainScripts.join(',')}
};
`;

  const prettierConfig = await prettier.resolveConfig(WORKSPACE_ROOT_PATH);
  await fs.writeFile(
    INDEX_OUTPUT_PATH,
    prettier.format(content, { parser: 'typescript', ...prettierConfig }),
    'utf8',
  );
};

main();
