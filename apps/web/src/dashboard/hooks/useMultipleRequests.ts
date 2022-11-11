import { AxiosInstance } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { axiosWithCredentials } from '@/utils';

type RequestKey = string;
export const useMultipleRequests = <T extends any>(
  requests: (RequestKey | null)[],
  fetcher: AxiosInstance = axiosWithCredentials,
  modifier?: (key: RequestKey, data: T) => T,
) => {
  const responsesRef = useRef<
    Record<
      RequestKey,
      { data: T | null; error: Error | null; isLoading: boolean }
    >
  >({});

  const [count, setCount] = useState<number>(0);
  const retrieveResponse = useCallback(
    (requestKey: RequestKey) => {
      responsesRef.current[requestKey] = {
        ...responsesRef.current[requestKey],
        isLoading: true,
      };

      fetcher
        .get<T>(requestKey)
        .then(({ data }) => {
          responsesRef.current[requestKey] = {
            data: !modifier ? data : modifier(requestKey, data),
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
    },
    [modifier],
  );

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
