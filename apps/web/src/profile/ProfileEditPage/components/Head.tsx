import { default as DocumentHead } from 'next/head';
import React from 'react';
import { css } from 'styled-components';

export const Head: React.FC = () => {
  return (
    <DocumentHead>
      <style>
        {
          css`
            html {
              background-color: #111319;
            }
          ` as any
          // FIXME: proper typings someday (breaks after React 18)
        }
      </style>
    </DocumentHead>
  );
};
