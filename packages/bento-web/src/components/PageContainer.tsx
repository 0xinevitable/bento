import styled from 'styled-components';

type PageContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const PageContainer: React.FC<PageContainerProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <Wrapper className={`px-4 pt-6 flex ${className}`} {...props}>
      <div className="w-full max-w-[1100px] mx-auto relative z-0 flex flex-col">
        {children}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  min-height: calc(100vh - 64px);
`;
