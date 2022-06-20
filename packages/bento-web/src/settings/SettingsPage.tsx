import React from 'react';

import { PageContainer } from '@/components/PageContainer';
import { useSession } from '@/hooks/useSession';
import { LoginNudge } from '@/profile/components/LoginNudge';

// import { Analytics } from '@/utils/analytics';

const SettingsPage = () => {
  // useEffect(() => {
  //   Analytics.logEvent('view_settings');
  // }, []);

  const { session, signOut } = useSession();

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
