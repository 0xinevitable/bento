import { OpenSeaAsset, fetchOpenSeaAssets } from '@bento/client';
import { safePromiseAll } from '@bento/common';
import { priceFromCoinGecko } from '@bento/core/lib/pricings/CoinGecko';
import axios from 'axios';
import groupBy from 'lodash.groupby';
import React, { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { useAxiosSWR } from '@/hooks/useAxiosSWR';
import { walletsAtom } from '@/recoil/wallets';

import { AddWalletModal } from './components/AddWalletModal';
import { AssetRatioChart } from './components/AssetRatioChart';
import { EmptyBalance } from './components/EmptyBalance';
import { EmptyWallet } from './components/EmptyWallet';
import { TokenBalanceItem } from './components/TokenBalanceItem';
import { WalletList } from './components/WalletList';
import {
  CosmosSDKWalletBalance,
  EVMWalletBalance,
  SolanaWalletBalance,
  WalletBalance,
} from './types/balance';

const walletBalanceReducer =
  (symbol: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    balance.symbol === symbol ? callback(acc, balance) : acc;

const DashboardPage = () => {
  const wallets = useRecoilValue(walletsAtom);

  const [
    cosmosWalletQuery,
    ethereumWalletQuery,
    polygonWalletQuery,
    klaytnWalletQuery,
    solanaWalletQuery,
  ] = useMemo(() => {
    const addrs = wallets.reduce(
      (acc, wallet) => {
        if (wallet.type === 'cosmos-sdk') {
          return { ...acc, cosmos: [...acc.cosmos, wallet.address] };
        }
        if (wallet.type === 'solana') {
          return { ...acc, solana: [...acc.solana, wallet.address] };
        }
        if (wallet.type !== 'evm') {
          return acc;
        }

        let _acc = acc;
        if (wallet.chains.includes('ethereum')) {
          _acc = { ..._acc, ethereum: [..._acc.ethereum, wallet.address] };
        }
        if (wallet.chains.includes('polygon')) {
          _acc = { ..._acc, polygon: [..._acc.polygon, wallet.address] };
        }
        if (wallet.chains.includes('klaytn')) {
          _acc = { ..._acc, klaytn: [..._acc.klaytn, wallet.address] };
        }
        return _acc;
      },
      { cosmos: [], solana: [], klaytn: [], polygon: [], ethereum: [] },
    );

    return [
      addrs.cosmos.join(','),
      addrs.ethereum.join(','),
      addrs.polygon.join(','),
      addrs.klaytn.join(','),
      addrs.solana.join(','),
    ];
  }, [wallets]);

  const { data: ethereumBalance = [] } = useAxiosSWR<EVMWalletBalance[]>(
    !ethereumWalletQuery ? null : `/api/evm/ethereum/${ethereumWalletQuery}`,
  );
  const { data: polygonBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !polygonWalletQuery ? null : `/api/evm/polygon/${polygonWalletQuery}`,
  );
  const { data: klaytnBalance = [] } = useAxiosSWR<EVMWalletBalance[]>(
    !klaytnWalletQuery ? null : `/api/evm/klaytn/${klaytnWalletQuery}`,
  );
  const { data: cosmosHubBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !cosmosWalletQuery
      ? null
      : `/api/cosmos-sdk/cosmos-hub/${cosmosWalletQuery}`,
  );
  const { data: osmosisBalance = [] } = useAxiosSWR<CosmosSDKWalletBalance[]>(
    !cosmosWalletQuery ? null : `/api/cosmos-sdk/osmosis/${cosmosWalletQuery}`,
  );
  const { data: solanaBalance = [] } = useAxiosSWR<SolanaWalletBalance[]>(
    !solanaWalletQuery ? null : `/api/solana/mainnet/${solanaWalletQuery}`,
  );

  const [NFTBalance, setNFTBalance] = useState<WalletBalance[]>([]);
  // FIXME: Replace hardcoded wallet address
  const HARDCODED_WALLET = '0x7777777141f111cf9f0308a63dbd9d0cad3010c4';
  useEffect(() => {
    safePromiseAll([
      fetchOpenSeaAssets({ owner: HARDCODED_WALLET }),
      fetchOpenSeaAssets({
        owner: HARDCODED_WALLET,
        cursor: 'LXBrPTI3MDY2NjU2MA==',
      }),
    ])
      .then(async (pagedAssets) => {
        const assets = pagedAssets.flat();
        // setNFTBalance(assets.groupBy())
        console.log(assets);
        const g: Record<string, OpenSeaAsset[]> = groupBy(
          assets,
          (v) => v.collection.slug,
        );
        console.log(g);

        const ethereumPrice = await priceFromCoinGecko('ethereum');

        const balances = await safePromiseAll(
          Object.keys(g).map(async (collectionSlug) => {
            const collection = g[collectionSlug][0].collection;
            const { data } = await axios
              .get(
                `https://api.opensea.io/api/v1/collection/${collectionSlug}/stats`,
              )
              .catch((error) => {
                console.log(error);
                // FIXME: Error handling
                return { data: { stats: { floor_price: 0 } } };
              });
            return {
              symbol: collection.name,
              walletAddress: HARDCODED_WALLET,
              balance: g[collectionSlug].length,
              logo: collection.image_url,
              price: ethereumPrice * data.stats.floor_price,
            };
          }),
        );

        setNFTBalance(balances);

        console.log(balances);
      })
      .catch(console.error);
  }, []);

  const tokenBalances = useMemo(() => {
    // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
    // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
    const balancesByPlatform = Object.entries(
      groupBy(
        [
          ethereumBalance,
          polygonBalance,
          klaytnBalance,
          cosmosHubBalance,
          osmosisBalance,
          solanaBalance,
          NFTBalance,
        ].flat(),
        (balance) => balance.symbol + balance.name,
      ),
    ).map((v) => v[1]);

    const tokens = balancesByPlatform
      .map((balances) => {
        // NOTE: balances 는 모두 같은 토큰의 정보를 담고 있기에, first 에서만 정보를 꺼내온다.
        const [first] = balances;

        return {
          symbol: first.symbol,
          name: first.name,
          logo: first.logo,
          tokenAddress: 'address' in first ? first.address : null,
          balances: balances,
          netWorth: balances.reduce(
            walletBalanceReducer(
              first.symbol,
              (acc, balance) =>
                acc +
                (balance.balance +
                  ('delegations' in balance ? balance.delegations : 0)) *
                  balance.price,
            ),
            0,
          ),
          amount: balances.reduce(
            walletBalanceReducer(
              first.symbol,
              (acc, balance) =>
                acc +
                balance.balance +
                ('delegations' in balance ? balance.delegations : 0),
            ),
            0,
          ),
          price: first.price,
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    console.log(tokens);
    return tokens.filter((v) => v.netWorth > 0);
  }, [
    ethereumBalance,
    polygonBalance,
    klaytnBalance,
    cosmosHubBalance,
    osmosisBalance,
    solanaBalance,
    NFTBalance,
  ]);

  const netWorthInUSD = useMemo(
    () => tokenBalances.reduce((acc, info) => acc + info.netWorth, 0),
    [tokenBalances],
  );

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);

  return (
    <PageContainer className="pt-0">
      <div className="absolute top-2 left-2 w-[120px] h-[120px] rounded-full bg-[#fa3737] blur-[88px] -z-10" />

      <div className="mt-10 w-full flex justify-between">
        <div className="flex flex-col justify-center">
          <h2 className="text-md font-semibold text-slate-50/60">Net worth</h2>
          <span className="mt-2 text-3xl font-bold text-slate-50">{`$${netWorthInUSD.toLocaleString()}`}</span>
        </div>
      </div>

      <TopSection>
        <div className="flex-1 min-w-sm flex">
          <AssetRatioChart
            tokenBalances={tokenBalances}
            netWorthInUSD={netWorthInUSD}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <h2 className="mt-2 text-md font-semibold text-slate-50/60">
            Wallets
            {wallets.length > 0 && (
              <span className="ml-1 text-slate-50/80 text-[#88a9ca]">
                {`(${wallets.length.toLocaleString()})`}
              </span>
            )}
          </h2>

          {wallets.length > 0 ? (
            <WalletList
              onClickConnect={() => setAddWalletModalVisible((prev) => !prev)}
            />
          ) : (
            <EmptyWallet
              onClickConnect={() => setAddWalletModalVisible((prev) => !prev)}
            />
          )}
        </div>
      </TopSection>

      <Divider className="my-4" />

      <section className="mt-4 flex flex-col">
        <h2 className="text-md font-semibold text-slate-50/60">
          Assets
          {tokenBalances.length > 0 && (
            <span className="ml-1 text-slate-50/80 text-[#88a9ca]">
              {`(${tokenBalances.length.toLocaleString()})`}
            </span>
          )}
        </h2>

        {tokenBalances.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {tokenBalances.map((info) => (
              <TokenBalanceItem
                key={`${info.symbol}-${
                  'tokenAddress' in info ? info.tokenAddress : 'native'
                }`}
                logo={info.logo ?? ''}
                {...info}
              />
            ))}
          </ul>
        ) : (
          <EmptyBalance />
        )}
      </section>

      <AddWalletModal
        visible={isAddWalletModalVisible}
        onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
      />
    </PageContainer>
  );
};

export default DashboardPage;

const TopSection = styled.section`
  width: 100%;
  display: flex;

  @media screen and (max-width: 647px) {
    flex-direction: column;
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background-color: rgba(248, 250, 252, 0.25);
`;
