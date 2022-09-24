import { MetaHead } from '@bento/client/components';
import { systemFontStack } from '@bento/client/styles';
import { Analytics } from '@bento/client/utils';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { HeaderSection as PrivateHeaderSection } from '@/landing-v2/sections/HeaderSection';

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
    router.push('/profile/intro');
  }, [router]);

  return (
    <Container>
      <MetaHead />

      <PrivateHeaderSection />

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
    /*
      FIXME: reset.css가 두번(Tailwind의 reset 스타일과 styled-reset) 들어가면서
      font-family가 우선순위 밀리는 문제 이렇게 해결.
      Tailwind 걷어내고 !important 없애기
    */
    font-family: 'Raleway', ${systemFontStack} !important;

    &:not(h1, h1 span) {
      transition: all 0.2s ease-in-out;
    }
  }

  & img {
    user-select: none;
  }
`;
