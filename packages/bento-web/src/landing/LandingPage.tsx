import { useEffect } from 'react';
import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';
import { systemFontStack } from '@/dashboard-landing/styles/fonts';
import { Analytics } from '@/utils/analytics';

import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { IdentitySection } from './sections/IdentitySection';
import { RoadmapSection } from './sections/RoadmapSection';
import { StatusQuoSection } from './sections/StatusQuoSection';

const LandingPage: React.FC = () => {
  useEffect(() => {
    Analytics.logEvent('view_landing', undefined);
  }, []);

  return (
    <Container>
      <MetaHead />

      <NavigationBar />

      <HeaderSection id="header" event="view_landing_section" />
      <DashboardSection id="dashboard" event="view_landing_section" />
      <StatusQuoSection id="status-quo" event="view_landing_section" />
      <IdentitySection id="identity" event="view_landing_section" />
      <RoadmapSection id="roadmap" event="view_landing_section" />
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

    &:not(h1, h1 span) {
      transition: all 0.2s ease-in-out;
    }
  }
`;
