import { createGlobalStyle } from 'styled-components';
import normalize from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    box-sizing: border-box;
    word-break: keep-all;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
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
