import { Global, css } from '@emotion/react';
import { default as DocumentHead } from 'next/head';
import React from 'react';

export const Head: React.FC = () => {
  return (
    <DocumentHead>
      <Global
        styles={[
          css`
            html {
              background-color: #111319;
            }
          `,
        ]}
      />
    </DocumentHead>
  );
};
