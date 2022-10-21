import { AxiosInstance } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { axios } from '@/utils';

type RequestKey = string;
export const useMultipleRequests = <T extends any>(
  requests: (RequestKey | null)[],
  fetcher: AxiosInstance = axios,
) => {
  const responsesRef = useRef<
    Record<
      RequestKey,
      { data: T | null; error: Error | null; isLoading: boolean }
    >
  >({});

  const [count, setCount] = useState<number>(0);
  const retrieveResponse = useCallback((requestKey: RequestKey) => {
    responsesRef.current[requestKey] = {
      ...responsesRef.current[requestKey],
      isLoading: true,
    };

    fetcher
      .get<T>(requestKey)
      .then(({ data }) => {
        responsesRef.current[requestKey] = {
          data,
          error: null,
          isLoading: false,
        };
        setCount((prev) => prev + 1);
      })
      .catch((error: any) => {
        responsesRef.current[requestKey] = {
          ...responsesRef.current[requestKey],
          error,
          isLoading: false,
        };
        setCount((prev) => prev + 1);
      });
  }, []);

  useEffect(() => {
    requests.forEach((requestKey) => {
      if (requestKey && !responsesRef.current[requestKey]) {
        retrieveResponse(requestKey);
      }
    });
  }, [requests]);

  const refetch = useCallback(() => {
    requests.forEach((requestKey) => {
      if (requestKey) {
        retrieveResponse(requestKey);
      }
    });
  }, [requests]);

  const responses = useMemo(() => {
    count;
    return Object.values(responsesRef.current);
  }, [responsesRef.current, count]);

  return { responses, refetch };
};
