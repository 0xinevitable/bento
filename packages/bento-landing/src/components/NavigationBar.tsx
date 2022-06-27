import React from 'react';
import styled from 'styled-components';

export const NavigationBar = () => {
  return (
    <Wrapper>
      <Container>
        <HiddenTitle>Bento</HiddenTitle>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  height: 64px;

  border-bottom: 1px solid #323232;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);

  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 90;
`;
const Container = styled.div`
  max-width: 1728px;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const HiddenTitle = styled.span`
  display: none;
`;
