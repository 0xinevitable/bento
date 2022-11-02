import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';

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
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s ease-in-out;

  ${({ focused }) =>
    focused
      ? css`
          border-bottom: 2px solid #6ae7e2;
        `
      : css`
          border-bottom: 2px solid black;
        `}
`;

const Field = styled.span`
  margin-bottom: 4px;
  font-size: 18px;
  white-space: break-spaces;
  line-height: 1.45;
  color: #868e96;
`;

const TextArea = styled.textarea`
  ${inputStyle}
`;
