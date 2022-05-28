import React from 'react';

import { PageContainer } from '@/components/PageContainer';

import { Header } from './components/Header';
import { LinkEventListSection } from './components/LinkEventListSection';
import { PageViewChart } from './components/PageViewChart';
import { ProfileListSection } from './components/ProfileListSection';

// import { Analytics } from '@/utils/analytics';

const HomePage = () => {
  // useEffect(() => {
  //   Analytics.logEvent('view_home');
  // }, []);

  return (
    <PageContainer>
      <Header />
      <PageViewChart />
      <LinkEventListSection />
      <ProfileListSection title="Trending" profiles={ExampleProfiles} />
      <ProfileListSection title="New" profiles={ExampleProfiles} />
    </PageContainer>
  );
};

export default HomePage;

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
