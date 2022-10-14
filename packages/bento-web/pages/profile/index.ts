import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';

import { UserProfile } from '@/profile/types/UserProfile';
import { FeatureFlags, Supabase } from '@/utils';

// /profile handler
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
        redirect: {
          permanent: false,
          destination:
            (context.locale === 'en' ? '' : `/${context.locale}`) +
            `/profile/intro`,
        },
      };
    } else {
      // user have profile
      return {
        redirect: {
          permanent: false,
          destination:
            (context.locale === 'en' ? '' : `/${context.locale}`) +
            `/u/${profile.username}`,
        },
      };
    }
  }

  // else not logged in
  return {
    redirect: {
      permanent: false,
      destination:
        (context.locale === 'en' ? '' : `/${context.locale}`) +
        '/profile/intro',
    },
  };
};

export default function ProfileHandlerDummy() {
  return null;
}
