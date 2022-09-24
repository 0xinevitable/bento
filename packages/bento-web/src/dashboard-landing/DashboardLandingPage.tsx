import { useEffect } from 'react';
import styled from 'styled-components';

import { Analytics } from '@/utils';

import { BackgroundSection } from './sections/BackgroundSection';
import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { WalletSection } from './sections/WalletSection';

const DashboardLandingPage = () => {
  useEffect(() => {
    Analytics.logEvent('view_dashboard_landing', undefined);
  }, []);

  return (
    <Container>
      <HeaderSection id="header" event="view_dashboard_landing_section" />
      <BackgroundSection
        id="background"
        event="view_dashboard_landing_section"
      />
      <DashboardSection id="dashboard" event="view_dashboard_landing_section" />
      <WalletSection id="wallets" event="view_dashboard_landing_section" />

      <Footer>
        <a
          title="INEVITABLE"
          href="https://inevitable.team"
          target="_blank"
          onClick={() =>
            Analytics.logEvent('click_team_link', {
              medium: 'dashboard_landing',
            })
          }
        >
          2022 INEVITABLE
        </a>
      </Footer>
    </Container>
  );
};

export default DashboardLandingPage;

const Container = styled.div`
  width: 100vw;
  padding-bottom: 100px;

  overflow: hidden;

  display: flex;
  flex-direction: column;
  background-color: black;
`;

const Footer = styled.footer`
  margin-top: 120px;
  margin-bottom: 100px;

  font-weight: 700;
  font-size: 24px;
  line-height: 120%;
  text-align: center;
  color: rgba(221, 204, 211, 0.88);

  & > a {
    color: unset;
  }
`;
