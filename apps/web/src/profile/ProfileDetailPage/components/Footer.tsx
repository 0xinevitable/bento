import styled from '@emotion/styled';

export const Footer = () => {
  return (
    <Container>
      <Text>LINKY</Text>
    </Container>
  );
};

const Container = styled.footer`
  margin: 24px 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Text = styled.span`
  font-weight: 900;
  color: #78797f;
`;
