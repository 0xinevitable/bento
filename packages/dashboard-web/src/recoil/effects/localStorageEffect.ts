import { AtomEffect, DefaultValue } from 'recoil';

export const localStorageEffect: <T>(key: string) => AtomEffect<T> = (
  key: string,
) => {
  const keyWithPrefix = `${key}`;

  return ({ setSelf, onSet }) => {
    if (typeof window === 'undefined') {
      return;
    }
    const savedValue = window.localStorage.getItem(keyWithPrefix);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }

    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        window.localStorage.removeItem(keyWithPrefix);
      } else {
        window.localStorage.setItem(keyWithPrefix, JSON.stringify(newValue));
      }
    });
  };
};
