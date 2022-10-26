import { cachedAxios } from '@bento/core';
import useSWR, { Key } from 'swr';
import { BareFetcher, PublicConfiguration } from 'swr/dist/types';

const fetcher = (url: string) => cachedAxios.get(url).then((res) => res.data);

export const useAxiosSWR = <Data = any, Error = any>(
  _key: Key,
  config?: Partial<PublicConfiguration<Data, Error, BareFetcher<Data>>>,
) => useSWR<Data, Error>(_key, fetcher, config);
