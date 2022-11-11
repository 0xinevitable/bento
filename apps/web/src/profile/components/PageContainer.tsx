import styled from '@emotion/styled';

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  ...props
}) => {
  return (
    <Wrapper {...props}>
      <Container>{children}</Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  min-height: calc(100vh - 64px);

  display: flex;
`;

const Container = styled.div`
  display: flex;
  position: relative;
  z-index: 0;
  flex-direction: column;
  width: 100%;
`;
