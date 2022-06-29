import dynamic from 'next/dynamic';
import React from 'react';

type NoSSRProps = {
  children?: React.ReactNode;
};

const _NoSSR: React.FC<NoSSRProps> = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export const NoSSR: any = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
});
