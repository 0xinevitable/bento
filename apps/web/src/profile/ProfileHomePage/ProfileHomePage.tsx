import { GetServerSideProps } from 'next';
import React from 'react';

import { MetaHead } from '@/components/system';
import { useHiddenBodyOverflow } from '@/hooks/useHiddenBodyOverflow';
import { useSession } from '@/hooks/useSession';

import { FeatureFlags } from '@/utils';

import { FixedLoginNudge } from '../components/LoginNudge';
import { PageContainer } from '../components/PageContainer';
import { Header } from './components/Header';
import { LinkEventListSection } from './components/LinkEventListSection';
import { PageViewChart } from './components/PageViewChart';
import { ProfileListSection } from './components/ProfileListSection';

export const getServerSideProps: GetServerSideProps = async () => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }
  return { props: {} };
};

const ProfileHomePage = () => {
  // useEffect(() => {
  //   Analytics.logEvent('view_home');
  // }, []);

  const { session } = useSession();
  useHiddenBodyOverflow(!session);

  return (
    <PageContainer>
      <MetaHead />

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
