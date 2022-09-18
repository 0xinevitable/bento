import styled from 'styled-components';

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const PageContainer: React.FC<PageContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Wrapper className={className} {...props}>
      <div className="w-full max-w-[1100px] mx-auto relative z-0 flex flex-col">
        {children}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 24px 16px 0;
  min-height: 100vh;
  min-height: calc(100vh - 64px);

  display: flex;
`;
