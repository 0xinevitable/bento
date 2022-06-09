import axios from 'axios';
import QueryString from 'query-string';

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
    name: string;
    image_url: string;
    description: string;
    banner_image_url: string;
  };
};

export type GetOpenSeaAssetsParams = {
  owner: string;
};

// https://github.com/linkyvc/frontend/pull/52
export const fetchOpenSeaAssets = async ({ owner }: GetOpenSeaAssetsParams) => {
  const url = `${OPENSEA_BASE_URL}/v1/assets`;
  const {
    data: { assets },
  } = await axios.get<{ assets: OpenSeaAsset[] }>(
    QueryString.stringifyUrl({ url, query: { owner } }),
    {
      headers: {
        'X-API-KEY': 'bea970cbbdae445a9f01b827f9ac227e',
      },
    },
  );
  return assets;
};
