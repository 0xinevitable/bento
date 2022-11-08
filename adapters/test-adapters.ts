import findWorkspaceRoot from 'find-yarn-workspace-root';
import fs from 'fs';
import path from 'path';

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

const adapters = fetchChildren(ADAPTER_ROOT_PATH);
for (const adapter of adapters) {
  const indexPath = path.join(adapter.path, 'index.ts');
  const hasIndex = fs.existsSync(indexPath);
  if (!hasIndex) {
    throw Error(`Adapter ${adapter.name} is missing index.ts`);
  }

  const services = fetchChildren(adapter.path);
  for (const service of services) {
    const servicePath = path.join(service.path, 'index.ts');
    const hasService = fs.existsSync(servicePath);
    if (!hasService) {
      throw Error(
        `Service ${service.name} is missing index.ts in adapter ${adapter.name}`,
      );
    }
  }
}
