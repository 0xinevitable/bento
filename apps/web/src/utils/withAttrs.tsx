import React from 'react';

export const withAttrs =
  <P extends {}, A extends Partial<P>>(atters: A, Component: React.FC<P>) =>
  (props: Omit<P, keyof A> & Partial<P>) =>
    (
      // @ts-ignore
      <Component {...props} {...atters} />
    );
