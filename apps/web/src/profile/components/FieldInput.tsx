import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useState } from 'react';

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  field: string;
  fieldStyle?: React.CSSProperties;
};

export const FieldInput: React.FC<Props> = ({
  field,
  fieldStyle,
  ...inputProps
}) => {
  const [focused, setFocused] = useState<boolean>(false);

  return (
    <Container focused={focused}>
      <Field style={fieldStyle}>{field}</Field>
      <Input
        type="text"
        spellCheck="false"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
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

export const inputStyle = css`
  padding: 12px 8px;
  font-size: 20px;
  font-weight: normal;
  transition: border-color 0.2s ease;
  background-color: #262c34;
  color: rgba(255, 255, 255, 0.85);
  border-radius: 4px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  resize: none;
  line-height: 1.4;
  outline: 0;

  &::placeholder {
    color: #adb5bd;
  }
`;

const Input = styled.input`
  ${inputStyle}
`;
