import { GetServerSideProps } from 'next';
import DocumentHead from 'next/head';
import React, { useMemo } from 'react';

import { NoSSR } from '@/components/NoSSR';
import { PageContainer } from '@/components/PageContainer';
import { useSession } from '@/hooks/useSession';
import { FeatureFlags } from '@/utils/FeatureFlag';
import { Supabase } from '@/utils/Supabase';

import { FixedLoginNudge } from '../components/LoginNudge';
import { ProfileInstance } from '../components/ProfileInstance';
import { UserProfile } from '../types/UserProfile';
import { useProfile } from './hooks/useProfile';

type Props =
  | {
      type: 'MY_PROFILE';
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
  const username = context.query.username as string | undefined;
  if (!username) {
    return { props: { type: 'MY_PROFILE' } };
  }

  let profile: UserProfile | null = null;
  const profileQuery = await Supabase.from('profile')
    .select('*')
    .eq('username', username);
  const profiles: UserProfile[] = profileQuery.data ?? [];

  if (profiles.length > 0) {
    profile = profiles[0];
  }

  if (!!profile) {
    return { props: { type: 'USER_PROFILE', profile } };
  }
  return { notFound: true };
};

const ProfileDetailPage = (props: Props) => {
  const { session } = useSession();

  const { profile, revaildateProfile } = useProfile(
    props.type === 'MY_PROFILE'
      ? { type: 'MY_PROFILE' }
      : {
          type: 'USER_PROFILE',
          username: props.profile?.username,
        },
  );

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

  return (
    <PageContainer>
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

      <div className="w-full max-w-xl mt-[64px] mx-auto">
        <NoSSR>
          <ProfileInstance
            profile={profile ?? undefined}
            revaildateProfile={revaildateProfile}
          />
        </NoSSR>
      </div>

      <FixedLoginNudge
        visible={!session && props.type === 'MY_PROFILE'}
        redirectTo="current"
      />
    </PageContainer>
  );
};

export default ProfileDetailPage;
