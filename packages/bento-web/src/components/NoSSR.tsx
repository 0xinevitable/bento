import dynamic from 'next/dynamic';
import React from 'react';

type NoSSRProps = React.PropsWithChildren<{}>;

const _NoSSR: React.FC<NoSSRProps> = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export const NoSSR = dynamic<NoSSRProps>(() => Promise.resolve(_NoSSR), {
  ssr: false,
});
