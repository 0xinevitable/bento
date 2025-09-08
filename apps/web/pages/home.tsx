import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { FeatureFlags } from '@/utils';

export { default } from '@/dashboard/DashboardIntroPage';

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }

  const locale = context.locale || 'en';

  // Auth removed - always show intro page for now
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'intro'])),
    },
  };
};