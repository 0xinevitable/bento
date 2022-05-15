import { WalletBalance } from '@/pages/api/erc/[network]/[walletAddress]';
import { useAxiosSWR } from '@/hooks/useAxiosSWR';
import { wallets } from '@dashboard/core/lib/config';
import React, { useMemo } from 'react';
import { TokenIcon } from './components/TokenIcon';

const LandingPage = () => {
  const [ethereumWalletQuery, klaytnWalletQuery] = useMemo(() => {
    const addrs = wallets.reduce(
      (acc, wallet) => {
        if (wallet.type !== 'erc') {
          return acc;
        }
        if (wallet.networks.includes('ethereum')) {
          return { ...acc, ethereum: [...acc.ethereum, wallet.address] };
        }
        if (wallet.networks.includes('klaytn')) {
          return { ...acc, klaytn: [...acc.klaytn, wallet.address] };
        }
        return acc;
      },
      { klaytn: [], ethereum: [] },
    );

    return [addrs.ethereum.join(','), addrs.klaytn.join(',')];
  }, []);

  const { data: ethereumBalance } = useAxiosSWR<WalletBalance[]>(
    `/api/erc/ethereum/${ethereumWalletQuery}`,
  );
  const { data: klaytnBalance } = useAxiosSWR<WalletBalance[]>(
    `/api/erc/klaytn/${klaytnWalletQuery}`,
  );

  const netWorthInUSD = useMemo(
    () =>
      (ethereumBalance ?? []).reduce(
        (acc, balance) => acc + balance.balance * balance.price,
        0,
      ) +
      (klaytnBalance ?? []).reduce(
        (acc, balance) => acc + balance.balance * balance.price,
        0,
      ),
    [ethereumBalance, klaytnBalance],
  );

  return (
    <div className="px-4">
      <div className="max-w-2xl mt-4 mx-auto">
        <h1 className="text-xl leading-tight font-bold">
          Multichain
          <br />
          Dashboard
        </h1>
        <div className="mt-4 flex flex-col justify-center">
          <span>Net worth</span>
          <span className="text-2xl font-bold">{`$${netWorthInUSD.toLocaleString()}`}</span>
        </div>

        <ul className="mt-8">
          {ethereumBalance && (
            <li className="mb-2 p-2 border rounded-md flex items-center drop-shadow-2xl">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                alt="ethereum"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md">ETH</span>
                <span className="text-2xl font-bold">
                  {`$${ethereumBalance
                    .reduce(
                      (acc, balance) => acc + balance.balance * balance.price,
                      0,
                    )
                    .toLocaleString()}`}
                </span>
              </div>
            </li>
          )}
          {klaytnBalance && (
            <li className="mb-2 p-2 border rounded-md flex items-center drop-shadow-2xl">
              <TokenIcon
                src="https://avatars.githubusercontent.com/u/41137100?s=200&v=4"
                alt="klaytn"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md">KLAY</span>
                <span className="text-2xl font-bold">
                  {`$${klaytnBalance
                    .reduce(
                      (acc, balance) => acc + balance.balance * balance.price,
                      0,
                    )
                    .toLocaleString()}`}
                </span>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
