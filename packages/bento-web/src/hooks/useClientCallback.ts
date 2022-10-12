import { DependencyList, useCallback } from 'react';

import { isServer } from '@/utils';

export const useClientCallback = <T extends Function>(
  callback: T,
  deps: DependencyList,
  fallback: T,
): T => {
  const func = useCallback(() => {
    if (isServer()) {
      return fallback();
    }
    return callback();
  }, deps);

  return func as any as T;
};
