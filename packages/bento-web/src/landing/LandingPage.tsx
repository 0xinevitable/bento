import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { MetaHead } from '@/components/MetaHead';
import { NavigationBar } from '@/components/NavigationBar';
import { Analytics } from '@/utils/analytics';

import { systemFontStack } from '@/dashboard-landing/styles/fonts';

import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { IdentitySection } from './sections/IdentitySection';
import { ProfileBanner } from './sections/ProfileBanner';
// import { RoadmapSection } from './sections/RoadmapSection';
import { StatusQuoSection } from './sections/StatusQuoSection';

const LandingPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    Analytics.logEvent('view_landing', undefined);
  }, []);

  const onClickBanner = useCallback(async () => {
    await Analytics.logEvent('click_dashboard_profile_nudge', undefined);
    router.push('/profile/landing');
  }, [router]);

  return (
    <Container>
      <MetaHead />

      <NavigationBar />
      <ProfileBanner
        id="profile-nudge"
        event="view_landing_section"
        onClickBanner={onClickBanner}
      />

      <HeaderSection id="header" event="view_landing_section" />
      <DashboardSection id="dashboard" event="view_landing_section" />
      <StatusQuoSection id="status-quo" event="view_landing_section" />
      <IdentitySection id="identity" event="view_landing_section" />
      {/* <RoadmapSection id="roadmap" event="view_landing_section" /> */}
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

  & img {
    user-select: none;
  }
`;
