import { FeatureFlags, Supabase } from '@bento/client/utils';
import { UserProfile } from '@bento/private/profile/types/UserProfile';
import { GetServerSideProps } from 'next';

// /profile handler
export const getServerSideProps: GetServerSideProps = async (context) => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }

  const { user: userFromCookie } = await Supabase.auth.api.getUserByCookie(
    context.req,
  );
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
          destination: '/profile/landing',
        },
      };
    } else {
      // user have profile
      return {
        redirect: {
          permanent: false,
          destination: `/u/${profile.username}`,
        },
      };
    }
  }

  // else not logged in
  return {
    redirect: {
      permanent: false,
      destination: '/profile/landing',
    },
  };
};

export default function ProfileHandlerDummy() {
  return null;
}
