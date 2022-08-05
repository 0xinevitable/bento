import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';
import { systemFontStack } from '@/dashboard-landing/styles/fonts';

import { DashboardSection } from './components/DashboardSection';
import { HeaderSection } from './components/HeaderSection';
import { IdentitySection } from './components/IdentitySection';
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
