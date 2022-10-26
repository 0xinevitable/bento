import { Config, randomOf } from '@bento/common';
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
  animation_url: string;

  name: string;
  description: string;

  collection: {
    slug: string;
    name: string;
    image_url: string;
    description: string;
    banner_image_url: string;
  };

  asset_contract: {
    symbol: string | '';
    address: string;
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
const getAssets = async ({ owner, cursor }: GetOpenSeaAssetsParams) => {
  const url = `${OPENSEA_BASE_URL}/v1/assets`;
  const {
    data: { assets, next },
  } = await cachedAxios.get<OpenSeaAssetsResponse>(
    QueryString.stringifyUrl({ url, query: { owner, cursor } }),
    {
      headers: {
        'X-API-KEY': randomOf(Config.OPENSEA_API_KEYS),
      },
    },
  );

  return {
    assets,
    cursor: next,
  };
};

export type OpenSeaCollectionStatsResponse = {
  stats: {
    one_day_volume: number;
    one_day_change: number;
    one_day_sales: number;
    one_day_average_price: number;
    seven_day_volume: number;
    seven_day_change: number;
    seven_day_sales: number;
    seven_day_average_price: number;
    thirty_day_volume: number;
    thirty_day_change: number;
    thirty_day_sales: number;
    thirty_day_average_price: number;
    total_volume: number;
    total_sales: number;
    total_supply: number;
    count: number;
    num_owners: number;
    average_price: number;
    num_reports: number;
    market_cap: number;
    floor_price: number;
  };
};

const getCollectionStats = async (slug: string) => {
  const { data } = await cachedAxios.get<OpenSeaCollectionStatsResponse>(
    `${OPENSEA_BASE_URL}/v1/collection/${slug}/stats`,
  );
  return data.stats;
};

export const OpenSea = {
  getAssets,
  getCollectionStats,
};
