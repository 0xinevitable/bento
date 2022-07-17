import { OpenSea, OpenSeaAsset } from '@bento/client';
import { Wallet, safePromiseAll } from '@bento/common';
import { priceFromCoinGecko } from '@bento/core/lib/pricings/CoinGecko';
import chunk from 'lodash.chunk';
import groupBy from 'lodash.groupby';
import { useEffect, useState } from 'react';

import { NFTWalletBalance } from '../types/balance';

const CHUNK_SIZE = 5;

type Options = {
  wallets: Wallet[];
};

export const useNFTBalances = ({ wallets }: Options) => {
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
    priceFromCoinGecko('ethereum').then(setEthereumPrice);
  }, [wallets]);

  useEffect(() => {
    const flattedAssets = Object.values(fetchedAssets)
      .map((v) => Object.values(v))
      .flat(3);
    const groupedByWalletAddress = groupBy(flattedAssets, 'walletAddress');

    safePromiseAll(
      Object.keys(groupedByWalletAddress).map(async (walletAddress) => {
        const groupByCollection: Record<
          string,
          (OpenSeaAsset & { walletAddress: string })[]
        > = groupBy(
          groupedByWalletAddress[walletAddress],
          (v) => v.collection.slug,
        );

        const balances: NFTWalletBalance[] = (
          await safePromiseAll(
            chunk(Object.keys(groupByCollection), CHUNK_SIZE).map(
              async (chunckedCollectionSlugs) =>
                safePromiseAll(
                  chunckedCollectionSlugs.map(async (collectionSlug) => {
                    const assets = groupByCollection[collectionSlug];
                    const first = assets[0];
                    const collection = first.collection;

                    const { floor_price: floorPrice } =
                      await OpenSea.getCollectionStats(collectionSlug).catch(
                        (error) => {
                          console.error(error);
                          // FIXME: Error handling
                          return { floor_price: 0 };
                        },
                      );

                    return {
                      symbol: first.asset_contract.symbol || null,
                      name: collection.name,
                      walletAddress,
                      balance: groupByCollection[collectionSlug].length,
                      logo: collection.image_url,
                      price: ethereumPrice * floorPrice,
                      type: 'nft' as const,
                      platform: 'opensea',
                      assets,
                    };
                  }),
                ),
            ),
          )
        ).flat();

        return balances;
      }),
    ).then((v) => setOpenSeaNFTBalance(v.flat()));
  }, [fetchedAssets]);

  return { balances: openSeaNFTBalance };
};
