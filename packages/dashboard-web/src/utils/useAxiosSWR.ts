import axios from 'axios';
import useSWR, { Key, SWRConfiguration } from 'swr';
import { defaultConfig } from 'swr/dist/utils/config';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export const useAxiosSWR = <Data = any, Error = any>(
  _key: Key,
  config?: typeof defaultConfig & SWRConfiguration<Data, Error>,
) => useSWR(_key, fetcher, config);
