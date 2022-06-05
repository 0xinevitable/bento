import { createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
    word-break: keep-all;
    -webkit-tap-highlight-color: transparent;
  }

  ::selection {
    color: rgba(255, 255, 255, 0.65);
    background-color: rgba(152, 24, 35, 0.65);
  }

  html {
    background-color: black;
  }

  body {
    margin: 0;
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  img {
    user-drag: none;
    user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
  }

  input {
    outline: 0;
  }

  button {
    padding: 0;
    border: 0;
    outline: 0;
    background-color: transparent;
    cursor: pointer;
  }

  ul,
  ol,
  li {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;
