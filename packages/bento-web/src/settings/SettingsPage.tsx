import React from 'react';

import { PageContainer } from '@/components/PageContainer';
import { LoginNudge } from '@/profile/components/LoginNudge';

// import { Analytics } from '@/utils/analytics';

const SettingsPage = () => {
  // useEffect(() => {
  //   Analytics.logEvent('view_settings');
  // }, []);

  return (
    <PageContainer>
      <LoginNudge />
    </PageContainer>
  );
};

export default SettingsPage;
