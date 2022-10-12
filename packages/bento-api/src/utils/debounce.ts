import { Config } from './Config';

export const debounce = <Arguments extends any[]>(
  func: (...args: Arguments) => any,
  wait: number,
  immediate?: boolean,
) => {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Arguments) {
    if (timeout) {
      clearTimeout(timeout);
    }
    if (Config.ENVIRONMENT !== 'production') {
      console.log('debounce');
    }
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func(...args);
    }, wait);
    if (immediate && !timeout) func(...args);
  };
};
