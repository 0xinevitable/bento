import dedent from 'dedent';
import DocumentHead from 'next/head';
import React, { useMemo } from 'react';

import { PageContainer } from '@/components/PageContainer';

import { ProfileInstance } from '../components/ProfileInstance';
import { ExampleUserProfile } from '../constants/ExampleUserProfile';

const data = {
  color: '#39e27d',
  background: dedent`
    radial-gradient(
      73.41% 194.47% at 0% -2.27%,
      #39e27d 0%,
      #90cff1 100%
    )
  `,
  profileImageURL: ExampleUserProfile.images[0],
  bio: 'Software Enginner 🦄⚡️\nBuilding the web3 world 🌎',
  links: ExampleUserProfile.links,
};

const profile = ExampleUserProfile;

const ProfileDetailPage = () => {
  const [title, description, image, url] = useMemo(
    () => [
      `${profile.displayName ?? profile.username} - Linky`,
      data.bio,
      data.profileImageURL,
      `https://linky.vc/address/${profile.username}`,
    ],
    [],
  );

  return (
    <PageContainer>
      <DocumentHead>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />

        <meta property="og:description" content={description} />
        <meta name="twitter:description" content={description} />

        <meta property="og:image" content={image} key="og:image" />
        <meta property="twitter:image" content={image} key="twitter:image" />

        <meta property="og:url" content={url} />
        <meta property="twitter:url" content={url} />
      </DocumentHead>

      <ProfileInstance profile={profile} />
    </PageContainer>
  );
};

export default ProfileDetailPage;
