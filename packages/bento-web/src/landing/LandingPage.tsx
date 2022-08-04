import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';
import { systemFontStack } from '@/dashboard-landing/styles/fonts';

import { DashboardSection } from './components/DashboardSection';
import { HeaderSection } from './components/HeaderSection';

const LandingPage: React.FC = () => {
  return (
    <Container>
      <MetaHead />

      <NavigationBar />

      <HeaderSection />
      <DashboardSection />
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

  * {
    font-family: 'Raleway', ${systemFontStack};
  }
`;
