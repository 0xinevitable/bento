import { GetServerSideProps } from 'next';
import DocumentHead from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { NoSSR } from '@/components/NoSSR';
import { PageContainer } from '@/components/PageContainer';
import { useSession } from '@/hooks/useSession';
import { FeatureFlags } from '@/utils/FeatureFlag';
import { Supabase } from '@/utils/Supabase';

import { ProfileInstance } from '../components/ProfileInstance';
import { UserProfile } from '../types/UserProfile';
import { useProfile } from './hooks/useProfile';

type Props =
  | {
      type: 'MY_PROFILE';
      profile: UserProfile;
    }
  | {
      type: 'USER_PROFILE';
      profile: UserProfile;
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

  // username should not be empty
  if (!username) {
    return {
      redirect: {
        permanent: false,
        destination: '/profile/landing',
      },
    };
  }

  let profile: UserProfile | null = null;
  const query = Supabase.from('profile') //
    .select('*')
    .eq('username', username.toLowerCase());
  const profiles: UserProfile[] = (await query).data ?? [];
  if (profiles.length > 0) {
    profile = profiles[0];
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
  const [profileType, setProfileType] = useState<'MY_PROFILE' | 'USER_PROFILE'>(
    props.type,
  );

  const { session } = useSession();
  useEffect(() => {
    if (session) {
      setProfileType(
        session.user?.id === props.profile.user_id
          ? 'MY_PROFILE'
          : 'USER_PROFILE',
      );
    }
  }, [session, props.profile]);

  // FIXME: Divide `useMyProfile` / `useUserProfile` if needed
  const { profile, revaildateProfile } = useProfile({
    type: 'USER_PROFILE',
    preloadedProfile: props.profile,
  });

  const [title, description, images] = useMemo(() => {
    let _title: string = '';
    let _description: string = '';
    let _images: string[] = [];

    if (profileType === 'MY_PROFILE') {
      _title = 'My Profile | Bento';
      _description = '';
      _images = ['/static/images/profile-default.jpg'];
    }

    if (profileType === 'USER_PROFILE') {
      const username = props.profile.username ?? 'unknown';
      const displayName = props.profile.display_name;

      if (!!displayName) {
        _title = `${displayName} (@${username}) | Bento`;
      } else {
        _title = `@${username} | Bento`;
      }

      _description = props.profile.bio ?? '';
      _images = [
        ...(props.profile.images ?? []),
        '/static/images/profile-default.jpg',
      ];
    }

    return [_title, _description, _images];
  }, [profile]);

  const router = useRouter();
  useEffect(() => {
    Supabase.auth.onAuthStateChange((event, _session) => {
      if (event === 'SIGNED_OUT') {
        if (profileType === 'MY_PROFILE') {
          setProfileType('USER_PROFILE');
        }
      }
    });
  }, [router, profileType]);

  const ogImageURL =
    images[0] || 'https://bento.finance/assets/mockups/profile-default.png';

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

        {ogImageURL && (
          <>
            <meta key="og:image" property="og:image" content={ogImageURL} />
            <meta
              key="twitter:image"
              property="twitter:image"
              content={ogImageURL}
            />
          </>
        )}

        {/* <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} /> */}
      </DocumentHead>

      <div className="w-full max-w-lg mt-[64px] mx-auto">
        {/* <NoSSR> */}
        <ProfileInstance
          profile={profile}
          revaildateProfile={revaildateProfile}
          isMyProfile={profileType === 'MY_PROFILE'}
        />
        {/* </NoSSR> */}
      </div>
    </PageContainer>
  );
};

export default ProfileDetailPage;
