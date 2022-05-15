import {
  Chain,
  CosmosHubChain,
  EthereumChain,
  KlaytnChain,
  OsmosisChain,
  SolanaChain,
} from './chains';
import { wallets } from './config';

export const chains: Record<
  // FIXME: wow
  'ethereum' | 'klaytn' | 'solana' | 'cosmos-hub' | 'osmosis',
  Chain
> = {
  ethereum: new EthereumChain(),
  klaytn: new KlaytnChain(),
  solana: new SolanaChain(),
  'cosmos-hub': new CosmosHubChain(),
  osmosis: new OsmosisChain(),
};

const safePromiseAll = async (promises: Promise<void>[]) =>
  (await Promise.allSettled(promises)).flatMap((res) =>
    res.status === 'fulfilled' ? res.value : [],
  );

const main = async () => {
  let totalValueInUSD = 0;

  await safePromiseAll(
    wallets.map(async (wallet) => {
      if (wallet.type == 'erc') {
        await safePromiseAll(
          wallet.networks.map(async (network) => {
            if (network === 'ethereum') {
              const chain = chains[network];
              const balance = await chain.getBalance(wallet.address);
              console.log(
                `${wallet.address} has ${balance} ${chain.currency.symbol}`,
              );
              const currencyPrice = await chain.getCurrencyPrice();
              totalValueInUSD += currencyPrice * balance;
            } else if (network === 'klaytn') {
              const chain = chains[network];
              const balance = await chain.getBalance(wallet.address);
              console.log(
                `${wallet.address} has ${balance} ${chain.currency.symbol}`,
              );
              const currencyPrice = await chain.getCurrencyPrice();
              totalValueInUSD += currencyPrice * balance;
            }
          }),
        );
      } else if (wallet.type === 'solana') {
        const chain = chains[wallet.type];
        const balance = await chain.getBalance(wallet.address);
        console.log(
          `${wallet.address} has ${balance} ${chain.currency.symbol}`,
        );
        const currencyPrice = await chain.getCurrencyPrice();
        totalValueInUSD += currencyPrice * balance;
      } else if (wallet.type === 'cosmos-hub') {
        const chain = chains[wallet.type];
        const balance = await chain.getBalance(wallet.address);
        console.log(
          `${wallet.address} has ${balance} ${chain.currency.symbol}`,
        );
        const currencyPrice = await chain.getCurrencyPrice();
        totalValueInUSD += currencyPrice * balance;
      } else if (wallet.type === 'osmosis') {
        const chain = chains[wallet.type];
        const balance = await chain.getBalance(wallet.address);
        console.log(
          `${wallet.address} has ${balance} ${chain.currency.symbol}`,
        );
        const currencyPrice = await chain.getCurrencyPrice();
        totalValueInUSD += currencyPrice * balance;
      }
    }),
  );

  console.log({ totalValueInUSD: totalValueInUSD.toLocaleString() });
};

main()
  .then()
  .catch((error) => console.error(error));
