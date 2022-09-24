// https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast
import React, { useEffect, useState } from 'react';

export const useInViewport = <T extends Element>(ref: React.RefObject<T>) => {
  const [isInViewport, setIsInViewport] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLoaded(true);
      }

      setIsInViewport(entry.isIntersecting);
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
  }, [ref]);

  return isInViewport || isLoaded;
};
