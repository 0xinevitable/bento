import React from 'react';
import styled from 'styled-components';

export const Preview = () => {
  return (
    <Wrapper>
      <Container>
        <Card>
          {/* <Profile
            profile={ExampleUserProfile}
            currentTab={ExampleUserProfile.tabs[0]}
          /> */}
        </Card>
      </Container>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  height: 100vh;
  flex: 1;
  position: sticky;
  top: 0;
  overflow-y: auto;
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Card: React.FC = ({ children }) => (
  <CardWrapper>
    <CardContainer>{children}</CardContainer>
  </CardWrapper>
);
const CardWrapper = styled.div`
  margin: 48px 0;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
`;
const CardContainer = styled.div`
  margin: 8px;
  width: 412px;
  min-height: 812px;
  background-color: #171b20;
`;

// const Profile = styled(UserProfile)`
//   padding-bottom: 32px;
// `;
