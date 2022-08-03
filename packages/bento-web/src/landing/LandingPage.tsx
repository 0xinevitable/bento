import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';

const LandingPage: React.FC = () => {
  return (
    <Container>
      <MetaHead />

      <NavigationBar />
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  width: 100vw;
  padding-bottom: 100px;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  background-color: black;
`;
