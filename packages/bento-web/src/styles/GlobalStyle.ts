import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    box-sizing: border-box;
    word-break: keep-all;
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

  input, button {
    outline: 0;
    background-color: transparent;
  }

  button {
    cursor: pointer;
  }

  ::selection {
    color: rgba(255, 255, 255, 0.65);
    background-color: rgba(152, 24, 35, 0.65);
  }

  .Tooltip {
    background: #222;
    color: white;
    pointer-events: none;
    border-radius: 6px;
    padding: 4px 6px;
    font-size: 14px;
  }

  .web3modal-modal-lightbox,
  #WEB3_CONNECT_MODAL_ID > div {
    z-index: 90;
  }
`;
