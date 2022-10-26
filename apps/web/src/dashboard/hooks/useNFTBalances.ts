import { Wallet, safeAsyncFlatMap, safePromiseAll } from '@bento/common';
import { OpenSea, OpenSeaAsset } from '@bento/core';
import chunk from 'lodash.chunk';
import groupBy from 'lodash.groupby';
import { useEffect, useState } from 'react';

import { useCachedPricings } from '@/hooks/pricings';
import { useLazyEffect } from '@/hooks/useLazyEffect';

import { NFTWalletBalance } from '@/dashboard/types/WalletBalance';

const CHUNK_SIZE = 5;

type Options = {
  wallets: Wallet[];
};

export const useNFTBalances = ({ wallets }: Options) => {
  const { getCachedPrice } = useCachedPricings();
  const [openSeaNFTBalance, setOpenSeaNFTBalance] = useState<
    NFTWalletBalance[]
  >([]);
  const [ethereumPrice, setEthereumPrice] = useState<number>(0);
  const [fetchedAssets, setFetchedAssets] = useState<{
    [walletAddress: string]: {
      [cursor: string]: (OpenSeaAsset & { walletAddress: string })[];
    };
  }>({});

  useEffect(() => {
    const fetchAssets = async (walletAddress: string) => {
      let cursor: string | undefined = undefined;
      let firstFetch: boolean = true;

      while (firstFetch || !!cursor) {
        // FIXME: TypeScript behaving strange here
        const res: { assets: OpenSeaAsset[]; cursor: string | undefined } =
          await OpenSea.getAssets({
            owner: walletAddress,
            cursor,
          });

        const { assets, cursor: fetchedCursor } = res;
        firstFetch = false;
        cursor = fetchedCursor;

        setFetchedAssets((prev) => ({
          ...prev,
          [walletAddress]: {
            ...prev[walletAddress],
            [cursor ?? 'undefined']: assets.map((v) => ({
              ...v,
              walletAddress,
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
    const groupedByWalletAddress = groupBy(flattedAssets, 'walletAddress');

    safeAsyncFlatMap(
      Object.keys(groupedByWalletAddress),
      async (walletAddress) => {
        const groupByCollection: Record<
          string,
          (OpenSeaAsset & { walletAddress: string })[]
        > = groupBy(
          groupedByWalletAddress[walletAddress],
          (v) => v.collection.slug,
        );

        const balances: NFTWalletBalance[] = (
          await safeAsyncFlatMap(
            chunk(Object.keys(groupByCollection), CHUNK_SIZE),
            async (chunckedCollectionSlugs) =>
              getNFTBalancesFromSlugs({
                slugs: chunckedCollectionSlugs,
                walletAddress,
                ethereumPrice,
                groupByCollection,
              }),
          )
        ).filter((v) => v.totalVolume > 0);

        return balances;
      },
    ).then((data) => {
      setOpenSeaNFTBalance(data);
    });
  }, [ethereumPrice, JSON.stringify(fetchedAssets)]);

  return {
    balances: openSeaNFTBalance,
  };
};

type Props = {
  slugs: string[];
  walletAddress: string;
  ethereumPrice: number;
  groupByCollection: Record<
    string,
    (OpenSeaAsset & {
      walletAddress: string;
    })[]
  >;
};
const getNFTBalancesFromSlugs = ({
  slugs,
  walletAddress,
  ethereumPrice,
  groupByCollection,
}: Props) =>
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
        symbol: first.asset_contract.symbol || null,
        name: collection.name,
        walletAddress,
        balance: groupByCollection[collectionSlug].length,
        logo: collection.image_url,
        price: ethereumPrice * floorPrice,
        totalVolume,
        type: 'nft' as const,
        platform: 'opensea',
        assets,
      };
    }),
  );
