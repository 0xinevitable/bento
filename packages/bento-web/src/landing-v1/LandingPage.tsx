import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';

import { MetaHead } from '@/components/system';

import { HeaderSection as PrivateHeaderSection } from '@/landing-v2/sections/HeaderSection';
import { Analytics } from '@/utils';

import { DashboardSection } from './sections/DashboardSection';
import { HeaderSection } from './sections/HeaderSection';
import { IdentitySection } from './sections/IdentitySection';
import { ProfileBanner } from './sections/ProfileBanner';
// import { RoadmapSection } from './sections/RoadmapSection';
import { StatusQuoSection } from './sections/StatusQuoSection';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['landing'])),
    },
  };
};

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
    &:not(h1, h1 span) {
      transition: all 0.2s ease-in-out;
    }
  }

  & img {
    user-select: none;
  }
`;
