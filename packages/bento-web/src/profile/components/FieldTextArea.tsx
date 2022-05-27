import React, { useState } from 'react';
import styled, { css } from 'styled-components';

import { inputStyle } from './FieldInput';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  field: string;
};

export const FieldTextArea: React.FC<Props> = ({ field, ...textAreaProps }) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <Container focused={focused}>
      <Field>{field}</Field>
      <TextArea
        spellCheck="false"
        rows={3}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...textAreaProps}
      />
    </Container>
  );
};

type ContainerProps = {
  focused: boolean;
};
const Container = styled.div<ContainerProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: 32px;
  transition: border-color 0.2s ease-in-out;

  ${
    // @ts-ignore
    ({ focused }) =>
      focused
        ? css`
            border-bottom: 2px solid #6ae7e2;
          `
        : css`
            border-bottom: 2px solid black;
          `
  }
`;

const Field = styled.span`
  margin-bottom: 4px;
  font-size: 18px;
  white-space: break-spaces;
  line-height: 1.45;
  color: #868e96;
`;

const TextArea = styled.textarea`
  ${
    // @ts-ignore
    inputStyle
  }
`;
