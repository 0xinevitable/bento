import styled from '@emotion/styled';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';

import { NoSSR } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { formatUsername } from '@/utils/format';

import { FeatureFlags, Supabase } from '@/utils';

import { useProfile } from '../../profile/hooks/useProfile';
import { ProfileInstance } from '../../profile/instance';
import { PageContainer } from '../components/PageContainer';
import { UserProfile } from '../types/UserProfile';

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

  const accessToken: string =
    (getCookie('supabase_auth_token', {
      req: context.req,
      res: context.res,
    }) as string) || '';
  const { user: userFromCookie } = await Supabase.auth.api.getUser(accessToken);

  const username = context.query.username as string | undefined;

  // username should not be empty
  if (!username) {
    return {
      redirect: {
        permanent: false,
        destination:
          (context.locale === 'en' ? '' : `/${context.locale}`) +
          `/profile/intro`,
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
        ...(await serverSideTranslations(context.locale || 'en', [
          'common',
          'dashboard',
        ])),
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
  const { profile, revalidateProfile } = useProfile({
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
      _images = props.profile.images ?? [];
    }

    if (profileType === 'USER_PROFILE') {
      const formattedUsername = formatUsername(props.profile.username);
      const displayName = props.profile.display_name;

      if (!!displayName) {
        _title = `${displayName} (${formattedUsername}) | Bento`;
      } else {
        _title = `${formattedUsername} | Bento`;
      }

      _description = props.profile.bio ?? '';
      _images = props.profile.images ?? [];
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
    <PageContainer>
      <Head>
        <title>{title}</title>
        <meta key="title" name="title" content={title} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="twitter:title" name="twitter:title" content={title} />

        <link
          key="canonical"
          rel="canonical"
          href={`https://bento.finance${router.asPath.split('?')[0]}`}
        />

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
      </Head>

      <MobileWrapper>
        <NoSSR>
          <ProfileInstance
            profile={profile}
            revalidateProfile={revalidateProfile}
            isMyProfile={profileType === 'MY_PROFILE'}
          />
        </NoSSR>
      </MobileWrapper>
    </PageContainer>
  );
};

export default ProfileDetailPage;

const MobileWrapper = styled.div`
  width: 100%;
  max-width: 32rem;
  margin: 64px auto 0;
`;
