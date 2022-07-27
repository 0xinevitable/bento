import dedent from 'dedent';
import { GetServerSideProps } from 'next';
import DocumentHead from 'next/head';
import React, { useMemo } from 'react';

import { PageContainer } from '@/components/PageContainer';
import { FeatureFlags } from '@/utils/FeatureFlag';

import { ProfileInstance } from '../components/ProfileInstance';
import { UserProfile } from '../types/UserProfile';
import { useProfile } from './hooks/useProfile';

const defaultProfile: UserProfile = {
  username: '',
  display_name: '',
  images: [],
  verified: false,
  bio: '',
  tabs: [],
  links: [],
};

export const getServerSideProps: GetServerSideProps = async () => {
  if (!FeatureFlags.isProfileEnabled) {
    return { notFound: true };
  }
  return { props: {} };
};

const ProfileDetailPage = () => {
  const [profile] = useProfile();

  console.log(profile);
  const [title, description, images, url] = useMemo(
    () => [
      `${profile?.display_name ?? profile?.username} - Linky`,
      profile?.bio ?? '',
      profile?.images || [],
      `https://linky.vc/address/${profile?.username}`,
    ],
    [profile],
  );

  return (
    <PageContainer>
      <DocumentHead>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        {images.length > 0 && (
          <>
            <meta property="og:image" content={images[0]} key="og:image" />
            <meta
              property="twitter:image"
              content={images[0]}
              key="twitter:image"
            />
          </>
        )}

        <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} />
      </DocumentHead>

      <div className="w-full max-w-xl mx-auto">
        <ProfileInstance
          // FIXME:
          profile={{
            ...(profile ?? defaultProfile),
            images:
              !!profile && !profile.images?.[0]
                ? ['/assets/mockups/profile-default.png']
                : null,
          }}
        />
      </div>
    </PageContainer>
  );
};

export default ProfileDetailPage;
