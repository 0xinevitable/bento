import styled from 'styled-components';

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const PageContainer: React.FC<PageContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Wrapper className={className} {...props}>
      <div>{children}</div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px 16px 0;
  min-height: 100vh;
  min-height: calc(100vh - 64px);

  display: flex;

  & > div {
    margin: 0 auto;
    width: 100%;
    max-width: 1328px;

    position: relative;
    z-index: 0;

    display: flex;
    flex-direction: column;
  }
`;
