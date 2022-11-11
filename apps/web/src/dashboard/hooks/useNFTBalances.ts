import { Wallet, safeAsyncFlatMap, safePromiseAll } from '@bento/common';
import { OpenSea, OpenSeaAsset } from '@bento/core';
import chunk from 'lodash.chunk';
import groupBy from 'lodash.groupby';
import { useEffect, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';
import { useLazyEffect } from '@/hooks/useLazyEffect';

import { NFTBalance } from '@/dashboard/types/TokenBalance';

const CHUNK_SIZE = 5;

type Options = {
  wallets: Wallet[];
};

export const useNFTBalances = ({ wallets }: Options) => {
  const { getCachedPrice } = useCachedPricings();
  const [openSeaNFTBalance, setOpenSeaNFTBalance] = useState<NFTBalance[]>([]);
  const [ethereumPrice, setEthereumPrice] = useState<number>(0);
  const [fetchedAssets, setFetchedAssets] = useState<{
    [account: string]: {
      [cursor: string]: (OpenSeaAsset & { account: string })[];
    };
  }>({});

  useEffect(() => {
    const fetchAssets = async (account: string) => {
      let cursor: string | undefined = undefined;
      let firstFetch: boolean = true;

      while (firstFetch || !!cursor) {
        // FIXME: TypeScript behaving strange here
        const res: { assets: OpenSeaAsset[]; cursor: string | undefined } =
          await OpenSea.getAssets({
            owner: account,
            cursor,
          });

        const { assets, cursor: fetchedCursor } = res;
        firstFetch = false;
        cursor = fetchedCursor;

        setFetchedAssets((prev) => ({
          ...prev,
          [account]: {
            ...prev[account],
            [cursor ?? 'undefined']: assets.map((v) => ({
              ...v,
              account,
            })),
          },
        }));
      }
    };

    const main = async () => {
      for (const wallet of wallets) {
        if (wallet.type === 'evm' && wallet.networks.includes('opensea')) {
          await fetchAssets(wallet.address);
        }
      }
    };

    main();
  }, [JSON.stringify(wallets)]);

  useLazyEffect(
    () => {
      // fetchPrices();
      setEthereumPrice(getCachedPrice('ethereum'));
    },
    [getCachedPrice],
    1_000,
  );
  // useInterval(fetchPrices, CACHE_TIME);

  useEffect(() => {
    const flattedAssets = Object.values(fetchedAssets)
      .map((v) => Object.values(v))
      .flat(3);
    const groupedByWalletAddress = groupBy(flattedAssets, 'account');

    safeAsyncFlatMap(Object.keys(groupedByWalletAddress), async (account) => {
      const groupByCollection: Record<
        string,
        (OpenSeaAsset & { account: string })[]
      > = groupBy(groupedByWalletAddress[account], (v) => v.collection.slug);

      const balances: NFTBalance[] = (
        await safeAsyncFlatMap(
          chunk(Object.keys(groupByCollection), CHUNK_SIZE),
          async (chunckedCollectionSlugs) =>
            getNFTBalancesFromSlugs({
              slugs: chunckedCollectionSlugs,
              account,
              ethereumPrice,
              groupByCollection,
            }),
        )
      ).filter((v) => v.totalVolume > 0);

      return balances;
    }).then((data) => {
      setOpenSeaNFTBalance(data);
    });
  }, [ethereumPrice, JSON.stringify(fetchedAssets)]);

  return {
    balances: openSeaNFTBalance,
  };
};

type Props = {
  slugs: string[];
  account: string;
  ethereumPrice: number;
  groupByCollection: Record<
    string,
    (OpenSeaAsset & {
      account: string;
    })[]
  >;
};
const getNFTBalancesFromSlugs = ({
  slugs,
  account,
  ethereumPrice,
  groupByCollection,
}: Props): Promise<(NFTBalance & { totalVolume: number })[]> =>
  safePromiseAll(
    slugs.map(async (collectionSlug) => {
      const assets = groupByCollection[collectionSlug];
      const first = assets[0];
      const collection = first.collection;

      const { floor_price: floorPrice, total_volume: totalVolume } =
        await OpenSea.getCollectionStats(collectionSlug).catch((error) => {
          console.error(error);
          // FIXME: Error handling
          return { floor_price: 0, total_volume: 0 };
        });

      return {
        type: 'nft' as const,
        // FIXME:
        chain: 'opensea' as const,
        symbol: first.asset_contract.symbol || null,
        ind: first.asset_contract.address,
        name: collection.name,
        account,
        balance: groupByCollection[collectionSlug].length,
        logo: collection.image_url,
        price: ethereumPrice * floorPrice,
        totalVolume,
        platform: 'opensea',
        assets,
      };
    }),
  );
