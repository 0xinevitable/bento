import { GetServerSideProps } from 'next';
import React from 'react';

import { PageContainer } from '@/components/PageContainer';
import { useSession } from '@/hooks/useSession';
import { useSignOut } from '@/hooks/useSignOut';
import { LoginNudge } from '@/profile/components/LoginNudge';
import { FeatureFlags } from '@/utils/FeatureFlag';

// import { Analytics } from '@/utils/analytics';

export const getServerSideProps: GetServerSideProps = async () => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }
  return { props: {} };
};

const SettingsPage = () => {
  // useEffect(() => {
  //   Analytics.logEvent('view_settings');
  // }, []);

  const { session } = useSession();
  const { signOut } = useSignOut();

  const isLoggedIn = !!session;

  return (
    <PageContainer>
      {!isLoggedIn && <LoginNudge />}
      {isLoggedIn && (
        <button className="py-4 px-8 bg-gray-300 " onClick={signOut}>
          Sign Out
        </button>
      )}
    </PageContainer>
  );
};

export default SettingsPage;
