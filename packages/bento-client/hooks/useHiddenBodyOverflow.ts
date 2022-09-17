import { useEffect } from 'react';

export const useHiddenBodyOverflow = (condition: boolean) =>
  useEffect(() => {
    if (condition) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [condition]);
