import { useEffect, useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  defaultValue?: T,
): [T | undefined | null, (value?: T | null) => void] => {
  const [storedValue, setStoredValue] = useState<T | undefined | null>(
    undefined,
  );

  useEffect(() => {
    const storeParsedValue = () => {
      const value = window.localStorage.getItem(key);
      if (value === null && defaultValue !== undefined) {
        setStoredValue(defaultValue);
        return;
      }
      setStoredValue(value ? JSON.parse(value) : null);
    };

    storeParsedValue();
  }, []);

  const setValue = (value?: T | null) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue || defaultValue, setValue];
};
