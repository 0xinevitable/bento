import styled from '@emotion/styled';

type EmptyProps = {
  children: React.ReactNode;
};
export const Empty: React.FC<EmptyProps> = ({ children }) => (
  <Container>
    <EmptyMessage>{children}</EmptyMessage>
  </Container>
);

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const EmptyMessage = styled.span`
  color: white;
  text-align: center;
`;
