import React, { useMemo } from 'react';

export const withAttrs =
  <P extends { className?: string }, A extends Partial<P>>(
    { className: classA, ...attrs }: A,
    Component: React.FC<P>,
  ) =>
  ({ className: classB, ...props }: Omit<P, keyof A> & Partial<P>) => {
    const className = useMemo(
      () => [classA, classB].join(' ').trim(),
      [classA, classB],
    );
    return (
      // @ts-ignore
      <Component {...props} {...attrs} className={className} />
    );
  };
