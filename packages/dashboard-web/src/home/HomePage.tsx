import { WalletBalance } from '@/pages/api/erc/[network]/[walletAddress]';
import { WalletBalance as TendermintWalletBalance } from '@/pages/api/tendermint/[network]/[walletAddress]';
import { useAxiosSWR } from '@/hooks/useAxiosSWR';
import { wallets } from '@dashboard/core/lib/config';
import React, { useMemo } from 'react';
import { TokenIcon } from './components/TokenIcon';

const LandingPage = () => {
  const [
    cosmosWalletQuery,
    ethereumWalletQuery,
    polygonWalletQuery,
    klaytnWalletQuery,
  ] = useMemo(() => {
    const addrs = wallets.reduce(
      (acc, wallet) => {
        if (wallet.type === 'tendermint') {
          return { ...acc, cosmos: [...acc.cosmos, wallet.address] };
        }
        if (wallet.type !== 'erc') {
          return acc;
        }
        if (wallet.networks.includes('ethereum')) {
          return { ...acc, ethereum: [...acc.ethereum, wallet.address] };
        }
        if (wallet.networks.includes('polygon')) {
          return { ...acc, polygon: [...acc.polygon, wallet.address] };
        }
        if (wallet.networks.includes('klaytn')) {
          return { ...acc, klaytn: [...acc.klaytn, wallet.address] };
        }
        return acc;
      },
      { cosmos: [], klaytn: [], polygon: [], ethereum: [] },
    );

    return [
      addrs.cosmos.join(','),
      addrs.ethereum.join(','),
      addrs.polygon.join(','),
      addrs.klaytn.join(','),
    ];
  }, []);

  const { data: ethereumBalance } = useAxiosSWR<WalletBalance[]>(
    `/api/erc/ethereum/${ethereumWalletQuery}`,
  );
  const { data: polygonBalance } = useAxiosSWR<TendermintWalletBalance[]>(
    `/api/erc/polygon/${polygonWalletQuery}`,
  );
  const { data: klaytnBalance } = useAxiosSWR<WalletBalance[]>(
    `/api/erc/klaytn/${klaytnWalletQuery}`,
  );
  const { data: cosmosHubBalance } = useAxiosSWR<TendermintWalletBalance[]>(
    `/api/tendermint/cosmos-hub/${cosmosWalletQuery}`,
  );
  const { data: osmosisBalance } = useAxiosSWR<TendermintWalletBalance[]>(
    `/api/tendermint/osmosis/${cosmosWalletQuery}`,
  );

  const netWorthInUSD = useMemo(
    () =>
      (ethereumBalance ?? []).reduce(
        (acc, balance) => acc + balance.balance * balance.price,
        0,
      ) +
      (polygonBalance ?? []).reduce(
        (acc, balance) => acc + balance.balance * balance.price,
        0,
      ) +
      (klaytnBalance ?? []).reduce(
        (acc, balance) => acc + balance.balance * balance.price,
        0,
      ) +
      (cosmosHubBalance ?? []).reduce(
        (acc, balance) =>
          acc +
          balance.balance * balance.price +
          balance.delegations * balance.price,
        0,
      ) +
      (osmosisBalance ?? []).reduce(
        (acc, balance) =>
          acc +
          balance.balance * balance.price +
          balance.delegations * balance.price,
        0,
      ),
    [
      ethereumBalance,
      polygonBalance,
      klaytnBalance,
      cosmosHubBalance,
      osmosisBalance,
    ],
  );

  return (
    <div className="px-4 pt-6">
      <div className="max-w-2xl mx-auto relative z-0">
        <div className="absolute top-2 left-2 w-[120px] h-[120px] rounded-full bg-[#fa3737] blur-[88px] -z-10" />

        <div className="mt-4 flex flex-col justify-center">
          <span className="text-xl text-slate-500">Net worth</span>
          <span className="text-2xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
        </div>

        <ul className="mt-8">
          {ethereumBalance && (
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
                alt="ethereum"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">ETH</span>
                <span className="text-2xl font-bold text-slate-50/90">
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
          {polygonBalance && (
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png"
                alt="ethereum"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">MATIC</span>
                <span className="text-2xl font-bold text-slate-50/90">
                  {`$${polygonBalance
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
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://avatars.githubusercontent.com/u/41137100?s=200&v=4"
                alt="klaytn"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">KLAY</span>
                <span className="text-2xl font-bold text-slate-50/90">
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
          {cosmosHubBalance && (
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png"
                alt="cosmos"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">ATOM</span>
                <span className="text-2xl font-bold text-slate-50/90">
                  {`$${cosmosHubBalance
                    .reduce(
                      (acc, balance) => acc + balance.balance * balance.price,
                      0,
                    )
                    .toLocaleString()}`}
                </span>
              </div>
            </li>
          )}
          {cosmosHubBalance && (
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png"
                alt="cosmos"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">Staked ATOM</span>
                <span className="text-2xl font-bold text-slate-50/90">
                  {`$${cosmosHubBalance
                    .reduce(
                      (acc, balance) =>
                        acc + balance.delegations * balance.price,
                      0,
                    )
                    .toLocaleString()}`}
                </span>
              </div>
            </li>
          )}
          {osmosisBalance && (
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png"
                alt="osmosis"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">OSMO</span>
                <span className="text-2xl font-bold text-slate-50/90">
                  {`$${osmosisBalance
                    .reduce(
                      (acc, balance) => acc + balance.balance * balance.price,
                      0,
                    )
                    .toLocaleString()}`}
                </span>
              </div>
            </li>
          )}
          {osmosisBalance && (
            <li className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md">
              <TokenIcon
                src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png"
                alt="osmosis"
              />
              <div className="ml-4 flex flex-col">
                <span className="text-md text-slate-400">Staked OSMO</span>
                <span className="text-2xl font-bold text-slate-50/90">
                  {`$${osmosisBalance
                    .reduce(
                      (acc, balance) =>
                        acc + balance.delegations * balance.price,
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
