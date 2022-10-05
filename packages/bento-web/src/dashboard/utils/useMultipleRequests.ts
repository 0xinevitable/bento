import axios from 'axios';
import produce, { Draft } from 'immer';
import { useCallback, useEffect, useState } from 'react';

type RequestKey = string;
export const useMultipleRequests = <T extends any>(
  requests: (RequestKey | null)[],
) => {
  const [responses, setResponses] = useState<
    Record<
      RequestKey,
      { data: T | null; error: Error | null; isLoading: boolean }
    >
  >({});

  const retrieveResponse = useCallback(async (requestKey: RequestKey) => {
    setResponses(
      produce(responses, (draft) => {
        draft[requestKey] = { ...draft[requestKey], isLoading: true };
      }),
    );

    try {
      const response = await axios.get<T>(requestKey);
      setResponses(
        produce(responses, (draft) => {
          draft[requestKey] = {
            data: response.data as Draft<T>,
            error: null,
            isLoading: false,
          };
        }),
      );
    } catch (error: any) {
      setResponses(
        produce(responses, (draft) => {
          draft[requestKey] = {
            ...draft[requestKey],
            error,
            isLoading: false,
          };
        }),
      );
    }
  }, []);

  useEffect(() => {
    requests.forEach((requestKey) => {
      if (requestKey && !responses[requestKey]) {
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

  return { responses, refetch };
};
