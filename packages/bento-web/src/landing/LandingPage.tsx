import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';
import { systemFontStack } from '@/dashboard-landing/styles/fonts';

import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { IdentitySection } from './sections/IdentitySection';
import { RoadmapSection } from './sections/RoadmapSection';
import { StatusQuoSection } from './sections/StatusQuoSection';

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
  width: 100vw;
  overflow: hidden;

  display: flex;
  flex-direction: column;

  section * {
    font-family: 'Raleway', ${systemFontStack};
  }
`;
