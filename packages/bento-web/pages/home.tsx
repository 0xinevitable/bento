import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { UserProfile } from '@/profile/types/UserProfile';
import { FeatureFlags, Supabase } from '@/utils';

export { default } from '@/dashboard/DashboardIntroPage';

export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }

  const accessToken: string =
    (getCookie('supabase_auth_token', {
      req: context.req,
      res: context.res,
    }) as string) || '';
  const { user: userFromCookie } = await Supabase.auth.api.getUser(accessToken);
  const loggedIn = !!userFromCookie;
  const locale = context.locale || 'en';

  // if logged in
  if (loggedIn) {
    let profile: UserProfile | null = null;
    const query = Supabase.from('profile') //
      .select('*')
      .eq('user_id', userFromCookie.id);
    const profiles: UserProfile[] = (await query).data ?? [];
    if (profiles.length > 0) {
      profile = profiles[0];
    }

    if (!profile?.username) {
      // user have no profile created
      return {
        props: {
          ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
        },
      };
    } else {
      // user have profile
      return {
        redirect: {
          permanent: false,
          destination:
            (locale === 'en' ? '' : `/${locale}`) + `/u/${profile.username}`,
        },
      };
    }
  }

  // else not logged in
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'intro'])),
    },
  };
};
