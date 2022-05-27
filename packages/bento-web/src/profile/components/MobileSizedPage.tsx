import DocumentHead from 'next/head';
import React from 'react';
import styled from 'styled-components';

type MobileSizedPageProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export const MobileSizedPage: React.FC<MobileSizedPageProps> = ({
  children,
  ...containerProps
}) => {
  return (
    <Wrapper>
      <DocumentHead>
        <style>
          {/* FIXME: */}
          {/* {
            // @ts-ignore
            css`
              html {
                background-color: #101217;
              }

              @media (max-width: 500px) {
                html {
                  background-color: #171b20;
                }
              }
            `
          } */}
        </style>
      </DocumentHead>
      <Container {...containerProps}>{children}</Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  background-color: #101217;
`;

const Container = styled.div`
  max-width: 500px;
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: 82px;
  padding-bottom: calc(constant(safe-area-inset-bottom) + 82px);
  padding-bottom: calc(env(safe-area-inset-bottom) + 82px);
  background-color: #171b20;
  position: relative;
  display: flex;
  flex-direction: column;
`;
