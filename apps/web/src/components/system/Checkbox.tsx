// Based from https://stackoverflow.com/questions/68789475/how-can-i-style-checkbox-with-css
import styled from '@emotion/styled';

import { withAttrs } from '@/utils/withAttrs';

export const Checkbox = withAttrs(
  { type: 'checkbox' },
  styled.input`
    width: 18px;
    height: 18px;
    color: #fe214a;
    vertical-align: middle;
    -webkit-appearance: none;
    background: none;
    border: 0;
    outline: 0;
    flex-grow: 0;
    border-radius: 50%;
    background-color: #25191b;
    transition: background-color 300ms;
    cursor: pointer;

    /* Pseudo element for check styling */
    &::before {
      content: '';
      color: transparent;
      display: block;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      border: 0;
      background-color: transparent;
      background-size: contain;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);
    }

    /* Checked */
    &:checked {
      background-color: currentcolor;

      &::before {
        box-shadow: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
      }
    }

    /* Disabled */

    &:disabled {
      background-color: rgba(255, 255, 255, 0.75);
      opacity: 0.84;
      cursor: not-allowed;
    }

    /* IE */

    &::-ms-check {
      content: '';
      color: transparent;
      display: block;
      width: inherit;
      height: inherit;
      border-radius: inherit;
      border: 0;
      background-color: transparent;
      background-size: contain;
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.75);
    }

    &:checked::-ms-check {
      box-shadow: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E %3Cpath d='M15.88 8.29L10 14.17l-1.88-1.88a.996.996 0 1 0-1.41 1.41l2.59 2.59c.39.39 1.02.39 1.41 0L17.3 9.7a.996.996 0 0 0 0-1.41c-.39-.39-1.03-.39-1.42 0z' fill='%23fff'/%3E %3C/svg%3E");
    }
  `,
);
