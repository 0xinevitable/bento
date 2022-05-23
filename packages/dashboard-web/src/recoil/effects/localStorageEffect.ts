import { AtomEffect, DefaultValue } from 'recoil';

export const localStorageEffect: <T>(
  key: string,
  defaultValue: T,
) => AtomEffect<T> = (key: string, defaultValue) => {
  const keyWithPrefix = `${key}`;

  return ({ setSelf, onSet }) => {
    if (typeof window === 'undefined') {
      return;
    }
    const savedValue = window.localStorage.getItem(keyWithPrefix);
    if (savedValue != null) {
      try {
        setSelf(JSON.parse(savedValue));
      } catch (error) {
        console.error(error);
        setSelf(defaultValue);
      }
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
