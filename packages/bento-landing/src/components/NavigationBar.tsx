import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export const NavigationBar = () => {
  return (
    <Wrapper>
      <Container>
        <Link href="/" passHref>
          <a>
            <HiddenTitle>Bento</HiddenTitle>
            <LogoWrapper>
              <LogoImage src="/assets/illusts/bento-logo-with-blur.png" />
            </LogoWrapper>
          </a>
        </Link>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.header`
  width: 100%;
  height: 64px;
  padding: 0 20px;

  border-bottom: 1px solid #323232;
  background-color: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);

  display: flex;
  justify-content: center;

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
const LogoWrapper = styled.div`
  width: 156px;
  height: 78px;
`;

const BLUR_SIZE = 31.2;
const LogoImage = styled.img`
  margin: ${-BLUR_SIZE}px;
  width: ${156 + BLUR_SIZE * 2}px;
  height: ${78 + BLUR_SIZE * 2}px;
`;
