import useSWR, { Key, SWRConfiguration } from 'swr';
import { defaultConfig } from 'swr/_internal';

import { cachedAxios } from '../cachedAxios';

const fetcher = (url: string) => cachedAxios.get(url).then((res) => res.data);

export const useAxiosSWR = <Data = any, Error = any>(
  _key: Key,
  config?: typeof defaultConfig & SWRConfiguration<Data, Error>,
) => useSWR<Data, Error>(_key, fetcher, config);
