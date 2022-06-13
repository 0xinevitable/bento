import QueryString from 'query-string';

import { cachedAxios } from '../cachedAxios';

export const OPENSEA_BASE_URL = 'https://api.opensea.io/api';

export type OpenSeaAsset = {
  id: number;
  token_id: string;
  num_sales: number;
  background_color: null;
  image_url: string;
  image_preview_url: string;
  name: string;
  description: string;

  collection: {
    slug: string;
    name: string;
    image_url: string;
    description: string;
    banner_image_url: string;
  };
};

export type GetOpenSeaAssetsParams = {
  owner: string;
  cursor?: string;
};

export type OpenSeaAssetsResponse = {
  assets: OpenSeaAsset[];
  next: string;
};

// https://github.com/linkyvc/frontend/pull/52
export const fetchOpenSeaAssets = async ({
  owner,
  cursor,
}: GetOpenSeaAssetsParams) => {
  const url = `${OPENSEA_BASE_URL}/v1/assets`;
  const {
    data: { assets, next },
  } = await cachedAxios.get<OpenSeaAssetsResponse>(
    QueryString.stringifyUrl({ url, query: { owner, cursor } }),
    {
      headers: {
        'X-API-KEY': 'bea970cbbdae445a9f01b827f9ac227e',
      },
    },
  );

  return {
    assets,
    cursor: next,
  };
};
