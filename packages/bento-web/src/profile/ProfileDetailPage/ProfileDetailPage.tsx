import { PageContainer } from '@/components/PageContainer';

import Link from 'next/link';
import dedent from 'dedent';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';

import DocumentHead from 'next/head';
import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { Modal } from '../components/Modal';
import { ExampleUserProfile } from '../constants/ExampleUserProfile';

import { ProfileImage } from './components/ProfileImage';
import { ProfileLinkSection } from './components/ProfileLinkSection';
import { QuestionSection } from './components/QuestionSection';
import { StickyTab } from './components/StickyTab';
import { Palette, usePalette } from './hooks/usePalette';
import { ProfileEditButton } from './components/ProfileEditButton';

import CheckCircleIcon from '@/assets/icons/ic-check-circle.svg';

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

enum AddressProfileTab {
  Links = 'Links',
  Questions = 'Questions',
  Assets = 'Assets',
}
const tabs = [
  AddressProfileTab.Links,
  AddressProfileTab.Questions,
  AddressProfileTab.Assets,
];

const profile = ExampleUserProfile;

const ProfilePage = () => {
  const [isProfileImageModalVisible, setProfileImageModalVisible] =
    useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<AddressProfileTab>(
    AddressProfileTab.Links,
  );

  const palette = usePalette(data.color);

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
      <BackgroundGradient style={{ background: data.background }}>
        <ProfileImageContainer>
          <ClickableProfileImage
            source={data.profileImageURL}
            onClick={() => setProfileImageModalVisible((value) => !value)}
          />
        </ProfileImageContainer>
      </BackgroundGradient>
      <ProfileImageBottomSpacer />
      <Information>
        <Link href="/profile/edit" passHref>
          <a>
            <ProfileEditButton />
          </a>
        </Link>
        <DisplayName>{profile.displayName ?? profile.username}</DisplayName>
        <Username style={{ color: palette.primary }}>
          {`@${profile.username}`}
        </Username>
        <Bio>{data.bio}</Bio>
        <PrimaryArchievement>
          <CheckCircleIcon color={palette.primary} />
          <span>
            Early holder of{' '}
            <PrimaryArchievementLink style={{ color: palette.primary }}>
              CloneX
            </PrimaryArchievementLink>
          </span>
        </PrimaryArchievement>
      </Information>
      <InformationSpacer />
      <Modal
        visible={isProfileImageModalVisible}
        onDismiss={() => setProfileImageModalVisible((value) => !value)}
      >
        <LargeProfileImage src={data.profileImageURL} />
      </Modal>
      <StickyTab
        selected={selectedTab}
        items={tabs}
        onChange={(tab) => setSelectedTab(tab)}
        primaryColor={palette.primary}
        shadowColor={palette.primaryShadow}
      />
      <AnimatePresence initial={false}>
        <TabContent palette={palette}>
          {selectedTab === AddressProfileTab.Links && (
            <AnimatedTab>
              <ProfileLinkSection items={data.links} />
            </AnimatedTab>
          )}
          {selectedTab === AddressProfileTab.Questions && (
            <AnimatedTab>
              <QuestionSection />
            </AnimatedTab>
          )}
        </TabContent>
      </AnimatePresence>
    </PageContainer>
  );
};

export default ProfilePage;

const BackgroundGradient = styled.div`
  height: 220px;
  position: relative;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const ProfileImageContainer = styled.div`
  position: absolute;
  bottom: -32px;
  left: 0;
  right: 0;
  height: 128px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ProfileImageBottomSpacer = styled.div`
  width: 100%;
  height: 48px;
`;
const ClickableProfileImage = styled(ProfileImage)`
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }
`;

const Information = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const DisplayName = styled.h1`
  margin: 0;
  font-weight: 900;
  font-size: 28px;
  line-height: 34px;
  text-align: center;
  color: #ffffff;
`;

const Username = styled.p`
  margin: 4px 0 0;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
`;

const Bio = styled.p`
  margin: 16px 0 0;
  font-size: 18px;
  line-height: 22px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  white-space: break-spaces;
`;

const PrimaryArchievement = styled.div`
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  & > span {
    margin-left: 4px;
    font-size: 16px;
    line-height: 19px;
    text-align: center;
    color: #78797f;
  }
`;
const PrimaryArchievementLink = styled.a`
  text-decoration-line: underline;
`;

const InformationSpacer = styled.div`
  width: 100%;
  height: 26px;
`;

const LargeProfileImage = styled.img`
  max-width: 500px;
  width: 85vw;
  aspect-ratio: 1;
  border-radius: 50%;
`;

type TabContentProps = {
  palette: Palette;
};
const TabContent = styled.div<TabContentProps>`
  padding: 16px 20px 0;

  button.submit {
    color: rgba(23, 27, 32, 0.75);

    &:active {
      opacity: 0.65;
    }

    ${
      // @ts-ignore
      ({ palette }) => css`
        background-color: ${palette.primary};
        box-shadow: 0 8px 16px ${palette.primaryShadow};
        text-shadow: 2px 2px 4px ${palette.darkShadow};

        &:hover {
          background-color: ${palette.dark};
          box-shadow: 0 4px 16px ${palette.darkShadow};
          transform: scale(1.05);
        }
      `
    };
  }
`;

const AnimatedTab = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, transform: 'scale(0.9)' }}
    animate={{ opacity: 1, transform: 'scale(1)' }}
    exit={{ opacity: 0, transform: 'scale(0.9)' }}
    style={{ originY: 0 }}
    transition={{ duration: 0.35 }}
    {...props}
  />
);

const Logo = styled.img`
  width: 56px;
  height: 56px;
  object-fit: cover;
`;
