import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';
import { systemFontStack } from '@/dashboard-landing/styles/fonts';

import { DashboardSection } from './components/DashboardSection';
import { HeaderSection } from './components/HeaderSection';
import { IdentitySection } from './components/IdentitySection';
import { RoadmapSection } from './components/RoadmapSection';
import { StatusQuoSection } from './components/StatusQuoSection';

const LandingPage: React.FC = () => {
  return (
    <Container>
      <MetaHead />

      <NavigationBar />

      <HeaderSection />
      <DashboardSection />
      <StatusQuoSection />
      <IdentitySection />
      <RoadmapSection />
    </Container>
  );
};

export default LandingPage;

const Container = styled.div`
  padding: 0 32px;
  width: 100vw;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  * {
    font-family: 'Raleway', ${systemFontStack};
  }
`;
