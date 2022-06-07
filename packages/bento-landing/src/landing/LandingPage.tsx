import styled from 'styled-components';

import { BackgroundSection } from './sections/BackgroundSection';
import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';

const LandingPage = () => {
  return (
    <Container>
      <HeaderSection />
      <BackgroundSection />
      <DashboardSection />
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  padding-bottom: 100px;

  display: flex;
  flex-direction: column;
  background-color: black;
`;
