import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type PortalProps = {
  id?: string;
};

export const Portal: React.FC<React.PropsWithChildren<PortalProps>> = ({
  id = 'portal',
  children,
}) => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    containerRef.current = document.querySelector(`#${id}`);
    return () => setMounted(false);
  }, [id]);

  return mounted && !!containerRef.current
    ? createPortal(children, containerRef.current)
    : null;
};
