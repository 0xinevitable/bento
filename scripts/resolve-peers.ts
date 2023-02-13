import { exec as execSync } from 'child_process';
import findWorkspaceRoot from 'find-yarn-workspace-root';
import { readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import util from 'util';

const exec = util.promisify(execSync);

export const WORKSPACE_ROOT_PATH = findWorkspaceRoot(null) ?? '';

const main = async () => {
  await exec(`cd ${WORKSPACE_ROOT_PATH}`);
  const { stdout } = await exec('yarn');
  let missingDependencies: { pkg: string; dep: string }[] = [];

  stdout.split('\n').forEach((line) => {
    if (line.includes('YN0002')) {
      let [pkg, dep] = line.split('doesn');
      pkg = pkg.split('│ ')[1];
      pkg = pkg.split('@npm:').slice(0, -1).join('').trim();

      dep = dep.split("'t provide ")[1];
      dep = dep.split(' (')[0].trim();
      if (!pkg || !dep) {
        return;
      }
      missingDependencies.push({ pkg, dep });
    }
  });

  missingDependencies = missingDependencies.filter((value, index, self) => {
    return (
      self.findIndex((x) => x.pkg === value.pkg && x.dep === value.dep) ===
      index
    );
  });

  let yarnrc = yaml.load(
    readFileSync(path.join(WORKSPACE_ROOT_PATH, './.yarnrc.yml'), 'utf8'),
  ) as any;
  console.log(yarnrc);

  missingDependencies.forEach(({ pkg, dep }) => {
    console.log('adding missing peer dep', [pkg, dep]);
    yarnrc = {
      ...yarnrc,
      packageExtensions: {
        ...yarnrc.packageExtensions,
        [`${pkg}@*`]: {
          ...yarnrc.packageExtensions[`${pkg}@*`],
          peerDependencies: {
            ...yarnrc.packageExtensions[`${pkg}@*`].peerDependencies,
            [dep]: '*',
          },
        },
      },
    };
  });

  const out = yaml.dump(yarnrc);
  writeFileSync(path.join(WORKSPACE_ROOT_PATH, './.yarnrc.yml'), out);
};

main();
