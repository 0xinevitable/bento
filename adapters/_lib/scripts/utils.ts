import { safeAsyncFlatMap } from '@bento/common';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { promises as fs } from 'fs';
import path from 'path';

export const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';
export const ADAPTER_ROOT_PATH = path.resolve(
  WORKSPACE_ROOT_PATH,
  './adapters',
);

export type Child = {
  name: string;
  path: string;
};

export const fetchChildren = async (
  basePath: string,
  filter: (value: string) => boolean,
  onlyDirs: boolean = true,
): Promise<Child[]> => {
  const files = await fs.readdir(basePath);
  return safeAsyncFlatMap(files, async (filename) => {
    let name = filename;
    if (!filter(filename)) {
      return [];
    }
    let adapterPath = path.join(basePath, filename);
    if (onlyDirs) {
      if (!(await fs.stat(adapterPath)).isDirectory()) {
        return [];
      }
    } else {
      name = name.replace('.ts', '');
      adapterPath = adapterPath.replace('.ts', '');
    }
    return { name, path: adapterPath };
  });
};
