import { Global, css } from '@emotion/react';
import { useTheme } from '@geist-ui/core';

import { systemFontStack } from '@/styles';

const globalStyles = css`
  :root {
    --SystemFontStack: ${systemFontStack};
  }

  html {
    overscroll-behavior-y: none;
  }

  * {
    box-sizing: border-box;
    word-break: keep-all;
    font-family: var(--SystemFontStack);
  }

  img {
    -webkit-user-drag: none;
  }

  input,
  button {
    background-color: transparent;
  }

  button {
    cursor: pointer;
    transition: all 0.15s ease;

    &:focus {
      opacity: 0.65;
    }
  }

  ::selection {
    color: rgba(255, 255, 255, 0.65);
    background-color: rgba(152, 24, 35, 0.65);
  }

  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .Tooltip {
    background: #222;
    color: white;
    pointer-events: none;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 18px;
    z-index: 2;
  }

  .web3modal-modal-lightbox,
  #WEB3_CONNECT_MODAL_ID > div {
    z-index: 90;
  }
`;

export const GlobalStyle: React.FC = () => {
  const theme = useTheme();

  return (
    <Global
      styles={[
        globalStyles,
        css`
          html,
          body {
            background-color: ${theme.palette.background};
            color: ${theme.palette.foreground};
          }

          html {
            font-size: 16px;
            scroll-behavior: smooth;
            --geist-icons-background: ${theme.palette.background};
          }

          body {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
            font-size: 1rem;
            line-height: 1.5;
            margin: 0;
            padding: 0;
            min-height: 100%;
            position: relative;
          }

          *,
          *:before,
          *:after {
            text-rendering: geometricPrecision;
            -webkit-tap-highlight-color: transparent;
          }

          p,
          small {
            font-weight: 400;
            color: inherit;
            letter-spacing: -0.005625em;
          }

          p {
            font-size: 1em;
            line-height: 1.625em;
          }

          small {
            line-height: 1.5;
            font-size: 0.875em;
          }

          b {
            font-weight: 600;
          }

          span {
            font-size: inherit;
            color: inherit;
            font-weight: inherit;
          }

          a {
            cursor: pointer;
            font-size: inherit;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
            -webkit-box-align: center;
            text-decoration: none;
          }

          a:hover {
            text-decoration: ${theme.expressiveness.linkHoverStyle};
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            color: inherit;
          }

          h1 {
            font-size: 3rem;
            letter-spacing: -0.02em;
            line-height: 1.5;
            font-weight: 700;
          }

          h2 {
            font-size: 2.25rem;
            letter-spacing: -0.02em;
            font-weight: 600;
          }

          h3 {
            font-size: 1.5rem;
            letter-spacing: -0.02em;
            font-weight: 600;
          }

          h4 {
            font-size: 1.25rem;
            letter-spacing: -0.02em;
            font-weight: 600;
          }

          h5 {
            font-size: 1rem;
            letter-spacing: -0.01em;
            font-weight: 600;
          }

          h6 {
            font-size: 0.875rem;
            letter-spacing: -0.005em;
            font-weight: 600;
          }

          button:focus,
          input:focus,
          select:focus,
          textarea:focus {
            outline: none;
          }

          code {
            color: ${theme.palette.code};
            font-family: ${theme.font.mono};
            font-size: 0.9em;
            white-space: pre-wrap;
          }

          code:before,
          code:after {
            content: '\`';
          }

          pre {
            padding: calc(${theme.layout.gap} * 0.9) ${theme.layout.gap};
            margin: ${theme.layout.gap} 0;
            border: 1px solid ${theme.palette.accents_2};
            border-radius: ${theme.layout.radius};
            font-family: ${theme.font.mono};
            white-space: pre;
            overflow: auto;
            line-height: 1.5;
            text-align: left;
            font-size: 14px;
            -webkit-overflow-scrolling: touch;
          }

          pre code {
            color: ${theme.palette.foreground};
            font-size: 1em;
            line-height: 1.25em;
            white-space: pre;
          }

          pre code:before,
          pre code:after {
            display: none;
          }

          pre :global(p) {
            margin: 0;
          }

          pre::-webkit-scrollbar {
            display: none;
            width: 0;
            height: 0;
            background: transparent;
          }

          hr {
            border-color: ${theme.palette.accents_2};
          }

          details {
            background-color: ${theme.palette.accents_1};
            border: none;
          }

          details:focus,
          details:hover,
          details:active {
            outline: none;
          }

          summary {
            cursor: pointer;
            user-select: none;
            list-style: none;
            outline: none;
          }

          summary::marker,
          summary::before,
          summary::-webkit-details-marker {
            display: none;
          }

          summary::-moz-list-bullet {
            font-size: 0;
          }

          summary:focus,
          summary:hover,
          summary:active {
            outline: none;
            list-style: none;
          }

          blockquote {
            padding: calc(0.667 * ${theme.layout.gap}) ${theme.layout.gap};
            color: ${theme.palette.accents_5};
            background-color: ${theme.palette.accents_1};
            border-radius: ${theme.layout.radius};
            margin: 1.5em 0;
            border: 1px solid ${theme.palette.border};
          }

          blockquote :global(*:first-of-type) {
            margin-top: 0;
          }

          blockquote :global(*:last-of-type) {
            margin-bottom: 0;
          }
        `,
      ]}
    />
  );
};
