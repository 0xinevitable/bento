import { safePromiseAll } from '@bento/common';

const importAndUpdate = async (path: string) => {
  const module = await import(path);
  return module.update();
};

const main = async () =>
  safePromiseAll([
    importAndUpdate('./ethereum'),
    importAndUpdate('./polygon'),
    // importAndUpdate('./bnb-smart-chain'),
    importAndUpdate('./solana'),
  ]);

main() //
  .catch(console.error);
