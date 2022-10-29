import { Global, css } from '@emotion/react';

import { ralewayFontStack, systemFontStack } from '@/styles';

const globalStyles = css`
  * {
    box-sizing: border-box;
    word-break: keep-all;

    &:lang(en) {
      font-family: ${ralewayFontStack};
    }

    &:lang(ko) {
      font-family: ${systemFontStack};
    }
  }

  .sys,
  .sys * {
    font-family: ${systemFontStack} !important;
  }

  html {
    background-color: black;
    scroll-behavior: smooth;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  img {
    -webkit-user-drag: none;
    max-width: unset;
  }

  input,
  button {
    outline: 0;
    background-color: transparent;
  }

  button {
    outline: 0;
    cursor: pointer;
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

export const GlobalStyle: React.FC = () => <Global styles={globalStyles} />;
