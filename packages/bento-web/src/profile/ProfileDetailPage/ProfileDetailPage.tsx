import { GetServerSideProps } from 'next';
import DocumentHead from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';

import { NoSSR } from '@/components/NoSSR';
import { PageContainer } from '@/components/PageContainer';
import { FeatureFlags } from '@/utils/FeatureFlag';
import { Supabase } from '@/utils/Supabase';

import { ProfileInstance } from '../components/ProfileInstance';
import { UserProfile } from '../types/UserProfile';
import { useProfile } from './hooks/useProfile';

type Props =
  | {
      type: 'MY_PROFILE';
      profile?: UserProfile | null;
    }
  | {
      type: 'USER_PROFILE';
      profile?: UserProfile | null;
    };

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }

  const { user: userFromCookie } = await Supabase.auth.api.getUserByCookie(
    context.req,
  );

  const username = context.query.username as string | undefined;

  // Anonymous user in `/profile` -> redirect to `/landing`
  // FIXME: 토큰 설정 직후 redirect 에는 여기서 계속 걸리는듯...
  if (!username && !userFromCookie) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile/landing',
      },
    };
  }

  let profile: UserProfile | null = null;
  let query = Supabase.from('profile').select('*');
  if (!!username) {
    query = query.eq('username', username);
  } else if (!!userFromCookie) {
    query = query.eq('user_id', userFromCookie.id);
  }
  const profiles: UserProfile[] = (await query).data ?? [];
  if (profiles.length > 0) {
    profile = profiles[0];
  }

  if (!username) {
    // Visiters or user without profile trying to view 'my profile' -> redirect to `/landing`
    if (!profile?.username) {
      return {
        redirect: {
          permanent: false,
          destination: '/profile/landing',
        },
      };
    }
    return { props: { type: 'MY_PROFILE' } };
  }

  if (!!profile) {
    return {
      props: {
        type:
          userFromCookie?.id === profile.user_id //
            ? 'MY_PROFILE'
            : 'USER_PROFILE',
        profile,
      },
    };
  }
  return { notFound: true };
};

const ProfileDetailPage = (props: Props) => {
  const { profile, revaildateProfile } = useProfile({
    type: props.type,
    preloadedProfile: props.profile,
  });

  const [title, description, images] = useMemo(() => {
    let _title: string = '';
    let _description: string = '';
    let _images: string[] = [];

    if (props.type === 'MY_PROFILE') {
      _title = 'My Profile | Bento';
      _description = '';
      _images = ['/static/images/profile-default.jpg'];
    }

    if (props.type === 'USER_PROFILE') {
      const username = props.profile?.username ?? 'unknown';
      const displayName = props.profile?.display_name;

      if (!!displayName) {
        _title = `${displayName} (@${username}) | Bento`;
      } else {
        _title = `@${username} | Bento`;
      }

      _description = props.profile?.bio ?? '';
      _images = [
        ...(props.profile?.images ?? []),
        '/static/images/profile-default.jpg',
      ];
    }

    return [_title, _description, _images];
  }, [profile]);

  const router = useRouter();
  useEffect(() => {
    Supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_OUT') {
        setTimeout(() => {
          router.push('/profile');
        });
      }
    });
  }, []);

  return (
    <PageContainer className="pt-0 px-0 z-10">
      <DocumentHead>
        <title>{title}</title>
        <meta key="title" name="title" content={title} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="twitter:title" name="twitter:title" content={title} />

        {description.length > 0 && (
          <>
            <meta key="description" name="description" content={description} />
            <meta
              key="og:description"
              property="og:description"
              content={description}
            />
            <meta
              key="twitter:description"
              name="twitter:description"
              content={description}
            />
          </>
        )}

        {images.length > 0 && (
          <>
            <meta key="og:image" property="og:image" content={images[0]} />
            <meta
              key="twitter:image"
              property="twitter:image"
              content={images[0]}
            />
          </>
        )}

        {/* <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} /> */}
      </DocumentHead>

      <div className="w-full max-w-lg mt-[64px] mx-auto">
        <NoSSR>
          <ProfileInstance
            profile={profile ?? undefined}
            revaildateProfile={revaildateProfile}
            isMyProfile={props.type === 'MY_PROFILE'}
          />
        </NoSSR>
      </div>
    </PageContainer>
  );
};

export default ProfileDetailPage;
