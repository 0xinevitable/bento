import dynamic from 'next/dynamic';
import React from 'react';

const _NoSSR: React.FC = (props) => (
  <React.Fragment>{props.children}</React.Fragment>
);

export const NoSSR: any = dynamic(() => Promise.resolve(_NoSSR), {
  ssr: false,
});
