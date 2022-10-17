import { safePromiseAll } from '@bento/common';

const importAndUpdate = async (path: string) => {
  const module = await import(path);
  return module.update().catch(console.error);
};

const main = async () =>
  safePromiseAll([
    // importAndUpdate('./ethereum'),
    // importAndUpdate('./polygon'),
    // importAndUpdate('./bnb-smart-chain'),
    // importAndUpdate('./avalanche'),
    // importAndUpdate('./solana'),
    // importAndUpdate('./klaytn'),
    importAndUpdate('./osmosis'),
  ]);

main() //
  .catch(console.error);
