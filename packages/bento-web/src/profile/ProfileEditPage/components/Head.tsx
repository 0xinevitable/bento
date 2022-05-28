import { default as DocumentHead } from 'next/head';
import React from 'react';
import { css } from 'styled-components';

export const Head: React.FC = () => {
  return (
    <DocumentHead>
      <style>
        {css`
          html {
            background-color: #111319;
          }
        `}
      </style>
    </DocumentHead>
  );
};
