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

  const tokenBalances = useMemo(() => {
    const tokens = [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
        netWorth: (ethereumBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance * balance.price,
          0,
        ),
        amount: (ethereumBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance,
          0,
        ),
        price: (ethereumBalance ?? [])[0]?.price ?? 0,
      },
      {
        symbol: 'MATIC',
        name: 'Polygon',
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
        netWorth: (polygonBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance * balance.price,
          0,
        ),
        amount: (polygonBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance,
          0,
        ),
        price: (polygonBalance ?? [])[0]?.price ?? 0,
      },
      {
        symbol: 'KLAY',
        name: 'Klaytn',
        logo: 'https://avatars.githubusercontent.com/u/41137100?s=200&v=4',
        netWorth: (klaytnBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance * balance.price,
          0,
        ),
        amount: (klaytnBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance,
          0,
        ),
        price: (klaytnBalance ?? [])[0]?.price ?? 0,
      },
      {
        symbol: 'COSMOS',
        name: 'Cosmos Hub',
        // FIXME: divide staking
        staking: true,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cosmos/info/logo.png',
        netWorth: (cosmosHubBalance ?? []).reduce(
          (acc, balance) =>
            acc +
            balance.balance * balance.price +
            balance.delegations * balance.price,
          0,
        ),
        amount: (cosmosHubBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance + balance.delegations,
          0,
        ),
        price: (cosmosHubBalance ?? [])[0]?.price ?? 0,
      },
      {
        symbol: 'OSMO',
        name: 'Osmosis',
        staking: true,
        logo: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/osmosis/info/logo.png',
        netWorth: (osmosisBalance ?? []).reduce(
          (acc, balance) =>
            acc +
            balance.balance * balance.price +
            balance.delegations * balance.price,
          0,
        ),
        amount: (osmosisBalance ?? []).reduce(
          (acc, balance) => acc + balance.balance + balance.delegations,
          0,
        ),
        price: (osmosisBalance ?? [])[0]?.price ?? 0,
      },
    ];

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    return tokens;
  }, [
    ethereumBalance,
    polygonBalance,
    klaytnBalance,
    cosmosHubBalance,
    osmosisBalance,
  ]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
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
          {tokenBalances.map((info) => (
            <li
              key={info.name}
              className="mb-2 p-2 px-3 border border-slate-700 rounded-md flex items-center drop-shadow-2xl bg-slate-800/25 backdrop-blur-md"
            >
              <TokenIcon src={info.logo} alt={info.name} />
              <div className="ml-4 flex flex-col">
                <span className="text-md">
                  <span className="text-slate-400">{info.symbol}</span>
                  <span className="ml-1 text-slate-400/40">
                    {info.amount.toLocaleString()}
                  </span>
                </span>
                <span className="text-2xl font-bold text-slate-50/90">
                  {`$${info.netWorth.toLocaleString()}`}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LandingPage;
