import { safePromiseAll } from '@bento/common';
import dedent from 'dedent';
import { promises as fs } from 'fs';
import path from 'path';
import prettier from 'prettier';

import {
  ADAPTER_ROOT_PATH,
  WORKSPACE_ROOT_PATH,
  fetchChildren,
} from './_lib/scripts/utils';

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
  const networkNameUnion = chains.map((v) => `'${v.name}'`).join(' | ');

  const chainScripts = await safePromiseAll(
    chains.map(async (chain) => {
      const services = await fetchChildren(chain.path, onlyIndex);
      const serviceScripts = await safePromiseAll(
        services.map(async (service) => {
          const protocols = await fetchChildren(
            service.path,
            onlyAdapters,
            false,
          );
          return dedent`
            '${service.name}': {
              info: require('./${service.name}'),
              protocols: {
                ${protocols
                  .map(
                    (v) =>
                      `'${v.name}': require('./${service.name}/${v.name}')`,
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

  const content = dedent`
import {
  BentoChainAdapter,
  BentoProtocolAdapter,
  BentoServiceAdapter,
} from './_lib/types';

export { type BentoChainAdapter };
export { type CosmosSDKBasedChain } from './_lib/types/cosmos-sdk';

type NetworkName = ${networkNameUnion};

type Adapters = Record<
  NetworkName,
  {
    chain: BentoChainAdapter;
    services: Record<
      string,
      {
        info: BentoServiceAdapter;
        protocols: Record<string, BentoProtocolAdapter>;
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
