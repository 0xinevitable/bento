import { Wallet } from '@bento/common';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';

import { FeatureFlags } from '@/utils';

import { useMultipleRequests } from './useMultipleRequests';

export const useKlaytnNFTs = (wallets: Wallet[]) => {
  const calculatedRequests = useMemo(
    () =>
      !FeatureFlags.isKlaytnDeFiEnabled
        ? []
        : wallets.flatMap((wallet) =>
            wallet.type === 'evm' && wallet.networks.includes('klaytn')
              ? // FIXME: Hardcoded URL
                `https://bentoapi.io/nft/chains/8217/wallets/${wallet.address}`
              : [],
          ),
    [JSON.stringify(wallets)],
  );

  // FIXME: Refetch rule
  const { responses: result, refetch } =
    useMultipleRequests<KlaytnNFTListResponse>(calculatedRequests, axios);

  const [klaytnNFTs, setKlaytnNFTs] = useState<KlaytnNFTAsset[]>([]);
  useEffect(() => {
    const items = result.flatMap((item) => {
      if (!item.data?.result) {
        return [];
      }
      return item.data.result.map((nft) => ({
        // ...nft,
        network: 'klaytn' as const,
        id: nft.id,
        token_id: nft.tokenId,
        name: nft.name,
        image_url: nft.image,
        image_preview_url: null,
        animation_url: nft.animationUrl,
        asset_contract: {
          address: nft.collection.address,
        },
        collection: {
          name: nft.collection.name,
          image_url: null,
        },
      }));
    });

    setKlaytnNFTs(items);
  }, [result]);

  return { klaytnNFTs };
};

export type KlaytnNFTAsset = {
  network: 'klaytn';
  id: string;
  token_id: string;
  name: string | null;
  image_url: string | null;
  image_preview_url: null;
  animation_url: string | null;
  asset_contract: {
    address: string;
  };
  collection: {
    name: string;
    image_url: string | null;
  };
};
export type KlaytnNFTAssetInput = {
  id: string;
  image: string;
  imageData: null;
  name: string;
  description: string;
  externalUrl: string;
  attributes: {
    traitType: string;
    value: string;
  }[];
  backgroundColor: string;
  animationUrl: string;
  youtubeUrl: string;
  tokenId: string;
  collection: {
    name: string;
    tickerSymbol: string;
    address: string;
  };
};
export type KlaytnNFTListResponse = {
  statusCode: 200;
  timestamp: string;
  path: string;
  result: KlaytnNFTAssetInput[];
};
