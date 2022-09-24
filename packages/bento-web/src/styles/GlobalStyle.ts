import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

import { systemFontStack } from '@/styles';

export const GlobalStyle = createGlobalStyle`
  ${reset}

  * {
    box-sizing: border-box;
    word-break: keep-all;

    /*
      FIXME: reset.css가 두번(Tailwind의 reset 스타일과 styled-reset) 들어가면서
      font-family가 우선순위 밀리는 문제 이렇게 해결.
      Tailwind 걷어내고 !important 없애기
    */
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
