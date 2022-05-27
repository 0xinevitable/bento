import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const Portal: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    containerRef.current = document.querySelector('#portal');
    return () => setMounted(false);
  }, []);

  return mounted && !!containerRef.current
    ? createPortal(children, containerRef.current)
    : null;
};
