import React from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { useHiddenBodyOverflow } from '@/hooks/useHiddenBodyOverflow';
import { useSession } from '@/hooks/useSession';

import { LoginNudge } from '../components/LoginNudge';
import { Header } from './components/Header';
import { LinkEventListSection } from './components/LinkEventListSection';
import { PageViewChart } from './components/PageViewChart';
import { ProfileListSection } from './components/ProfileListSection';

// import { Analytics } from '@/utils/analytics';

const ProfileHomePage = () => {
  // useEffect(() => {
  //   Analytics.logEvent('view_home');
  // }, []);

  const { session } = useSession();
  useHiddenBodyOverflow(!session);

  return (
    <PageContainer>
      <Header />
      <PageViewChart />
      <LinkEventListSection />
      <ProfileListSection title="Trending" profiles={ExampleProfiles} />
      <ProfileListSection title="New" profiles={ExampleProfiles} />

      {!session && <FixedLoginNudge />}
    </PageContainer>
  );
};

export default ProfileHomePage;

const FixedLoginNudge = styled(LoginNudge)`
  padding-top: 1.5rem;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(24px);
  z-index: 50;

  & img.lock-illust {
    filter: drop-shadow(0px 16px 48px rgba(151, 42, 53, 0.45));
  }
`;

const ExampleProfiles = [
  {
    title: 'Charlton',
    image: '/assets/mockups/profile-1.png',
  },
  {
    title: 'Vincent',
    image: '/assets/mockups/profile-2.png',
  },
  {
    title: 'Juice',
    image: '/assets/mockups/profile-3.png',
  },
  {
    title: 'Type',
    image: '/assets/mockups/profile-4.png',
  },
  {
    title: 'Juno',
    image: '/assets/mockups/profile-1.png',
  },
];
