import { useCallback, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T,
): [T | undefined, (value: T) => void] => {
  const [currentState, setCurrentState] = useState<T | undefined>(() => {
    if (typeof localStorage === 'undefined') {
      return undefined;
    }

    const storedJson = localStorage.getItem(key);
    return storedJson ? JSON.parse(storedJson) : defaultValue;
  });

  const setState = useCallback(
    (value: T) => {
      const savedValue = JSON.stringify(value);

      localStorage.setItem(key, savedValue);
      setCurrentState(value);
    },
    [key],
  );

  return [currentState, setState];
};
