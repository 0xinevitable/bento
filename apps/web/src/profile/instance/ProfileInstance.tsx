import { Wallet } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import axios, { AxiosError } from 'axios';
import dedent from 'dedent';
import { AnimatePresence } from 'framer-motion';
import groupBy from 'lodash.groupby';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { AnimatedTab } from '@/components/AnimatedTab';
import { Modal } from '@/components/system';
import { useLazyEffect } from '@/hooks/useLazyEffect';
import { useWalletContext } from '@/hooks/useWalletContext';
import { formatUsername } from '@/utils/format';

import { useNFTBalances } from '@/dashboard/hooks/useNFTBalances';
import { useWalletBalances } from '@/dashboard/hooks/useWalletBalances';
import {
  DashboardTokenBalance,
  WalletBalance,
} from '@/dashboard/types/TokenBalance';
import { Colors } from '@/styles';
import {
  Analytics,
  FeatureFlags,
  Supabase,
  copyToClipboard,
  toast,
} from '@/utils';

import {
  ProfileEditor,
  UserInformationDraft,
} from '../components/ProfileEditor';
import { Palette, usePalette } from '../hooks/usePalette';
import { UserProfile } from '../types/UserProfile';
import { ErrorResponse } from '../types/api';
import { FixedFooter } from './components/FixedFooter';
import { ProfileViewer } from './components/ProfileViewer';
import { StickyTab } from './components/StickyTab';
import { TickerCarousel } from './components/TickerCarousel';
import { AssetSection } from './sections/AssetSection';
import { NFTSection } from './sections/NFTSection';
import { ProfileLinkSection } from './sections/ProfileLinkSection';
import { ProfileWalletList } from './sections/ProfileWalletList';

const EMPTY_DRAFT: UserInformationDraft = {
  username: '',
  displayName: '',
  bio: '',
};

const data = {
  color: '#ff3856',
  background: dedent`
    linear-gradient(to right bottom, #E35252 0%, #DB6E57 29.47%, #C22E3A 65.1%)
  `,
};

enum ProfileTab {
  Links = 'Links',
  Questions = 'Questions',
  Wallets = 'Wallets',
  Assets = 'Assets',
  NFTs = 'NFTs',
}

const PROFILE_TABS = [
  ...(FeatureFlags.isProfileLinksEnabled ? [ProfileTab.Links] : []),
  ...(FeatureFlags.isProfileQuestionsEnabled ? [ProfileTab.Questions] : []),
  ProfileTab.Wallets,
  ProfileTab.Assets,
  ProfileTab.NFTs,
];

type ProfileInstanceProps = {
  profile: UserProfile | null;
  revalidateProfile?: () => Promise<void>;
  isMyProfile?: boolean;
};

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

const fetchWallets = async (userId: string): Promise<Wallet[]> => {
  const walletQuery = await Supabase.from('wallets')
    .select('*')
    .eq('user_id', userId);
  return walletQuery.data ?? [];
};

export const ProfileInstance: React.FC<ProfileInstanceProps> = ({
  profile,
  revalidateProfile,
  isMyProfile = false,
}) => {
  const router = useRouter();
  const { t } = useTranslation('dashboard');
  const [isProfileImageModalVisible, setProfileImageModalVisible] =
    useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<ProfileTab>(PROFILE_TABS[0]);
  const tabEventProps = useMemo(
    () =>
      !profile
        ? null
        : {
            tab: selectedTab.toLowerCase(),
            user_id: profile.user_id,
            username: profile.username,
            is_my_profile: isMyProfile,
          },
    [selectedTab, profile, isMyProfile],
  );

  const hasLoggedPageViewEvent = useRef<boolean>(false);
  useEffect(() => {
    if (!profile || hasLoggedPageViewEvent.current) {
      return;
    }
    hasLoggedPageViewEvent.current = true;
    Analytics.logEvent('view_profile', {
      user_id: profile.user_id,
      username: profile.username,
      is_my_profile: isMyProfile,
    });
  }, [profile, isMyProfile]);

  // TODO: check if this render twice in production too
  useEffect(() => {
    if (!tabEventProps) {
      return;
    }
    Analytics.logEvent('view_profile_tab', tabEventProps);
  }, [JSON.stringify(tabEventProps)]);

  const { wallets, setWallets } = useWalletContext();
  useEffect(() => {
    if (!!profile?.user_id) {
      fetchWallets(profile.user_id)
        .then(setWallets)
        .catch(() => {
          setWallets([]);
        });
    }
  }, [profile?.user_id]);

  const { balances: walletBalances } = useWalletBalances({ wallets });
  const { balances: nftBalances } = useNFTBalances({ wallets });

  const [tokenBalances, setTokenBalances] = useState<DashboardTokenBalance[]>(
    [],
  );
  useLazyEffect(
    () => {
      // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
      // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
      const balancesByPlatform = Object.entries(
        groupBy<WalletBalance>(
          [...walletBalances, ...nftBalances],
          (balance) => balance.symbol + balance.name,
        ),
      ).map((v) => v[1]);

      const tokens = balancesByPlatform
        .map((balances) => {
          // NOTE: balances 는 모두 같은 토큰의 정보를 담고 있기에, first 에서만 정보를 꺼내온다.
          const [first] = balances;

          const amount = balances.reduce(
            walletBalanceReducer(
              first.symbol ?? first.name,
              (acc, balance) => acc + balance.balance,
            ),
            0,
          );

          return {
            platform: first.chain,
            symbol: first.symbol,
            name: first.name,
            logo: first.logo,
            type: first.type,
            tokenAddress: first.ind,
            balances: balances,
            netWorth: amount * first.price,
            amount,
            price: first.price,
            coinGeckoId: 'coinGeckoId' in first ? first.coinGeckoId : undefined,
          };
        })
        .flat();

      tokens.sort((a, b) => b.netWorth - a.netWorth);
      setTokenBalances(tokens.filter((v) => v.netWorth > 0));
    },
    [walletBalances, nftBalances],
    500,
  );

  const nftAssets = useMemo<OpenSeaAsset[]>(
    () =>
      nftBalances?.flatMap((item) => ('assets' in item ? item.assets : [])) ??
      [],
    [nftBalances],
  );

  const palette = usePalette(data.color);
  const profileImageURL =
    profile?.images?.[0] || '/assets/mockups/profile-default.png';

  const [isEditing, setEditing] = useState<boolean>(false);

  const [draft, setDraft] = useState<UserInformationDraft>({
    username: '',
    displayName: '',
    bio: '',
  });
  const onProfileEdit = useCallback(async () => {
    if (!isEditing) {
      Analytics.logEvent('click_edit_my_profile', {
        title: 'Edit Profile',
        medium: 'profile',
      });
      setDraft({
        username: profile?.username ?? '',
        displayName: profile?.display_name ?? '',
        bio: profile?.bio ?? '',
      });
      setTimeout(() => {
        setEditing(true);
      });
      return;
    }

    // FIXME: Duplicated logic
    try {
      const { data } = await axios.post(`/api/profile`, {
        username: draft.username.toLowerCase(),
        display_name: draft.displayName,
        bio: draft.bio,
      });
      console.log(data);

      const [createdProfile] = data.body as UserProfile[];

      setEditing(false);
      setDraft(EMPTY_DRAFT);

      toast({
        type: 'success',
        title: 'Changes Saved',
      });

      if (createdProfile.username !== profile?.username) {
        router.push(`/u/${createdProfile.username}`);
      } else {
        revalidateProfile?.();
      }
    } catch (e) {
      if (e instanceof AxiosError) {
        const errorResponse = e.response?.data as ErrorResponse;
        if (errorResponse?.code === 'USERNAME_UNUSABLE') {
          toast({
            type: 'error',
            title: errorResponse.message,
            description: 'Please choose another username',
          });
          setDraft((prev) => ({ ...prev, username: '' }));
        } else if (errorResponse?.code === 'VALUE_REQUIRED') {
          toast({
            type: 'error',
            title: errorResponse.message,
          });
        } else {
          toast({
            type: 'error',
            title: 'Server Error',
            description: errorResponse?.message || 'Something went wrong',
          });
        }
      }
    }
  }, [profile, isEditing, draft, router]);

  return (
    <React.Fragment>
      <TickerCarousel />

      <ProfileImageContainer $isDefault={!profile?.images?.[0]}>
        <ProfileImage
          src={profileImageURL}
          $isDefault={!profile?.images?.[0]}
        />

        {!!profile && (
          <EarlyBentoBadge
            alt="2022 OG - Early Bento"
            src="/assets/profile/2022-early-bento.png"
          />
        )}

        {isMyProfile && !isEditing && (
          <ProfileEditButton onClick={onProfileEdit}>
            {t('Edit Profile')}
          </ProfileEditButton>
        )}

        <Information>
          <ProfileViewer profile={profile ?? undefined} />
        </Information>
      </ProfileImageContainer>

      <ProfileEditModal
        visible={isEditing}
        onDismiss={() => setEditing((prev) => !prev)}
      >
        <ProfileEditContainer>
          <ProfileEditor
            draft={draft}
            setDraft={setDraft}
            onSubmit={onProfileEdit}
          />
        </ProfileEditContainer>
      </ProfileEditModal>

      <Modal
        visible={isProfileImageModalVisible}
        onDismiss={() => setProfileImageModalVisible((prev) => !prev)}
      >
        <LargeProfileImage src={profileImageURL} />
      </Modal>
      <StickyTab
        selected={selectedTab}
        items={PROFILE_TABS}
        onChange={(tab) => setSelectedTab(tab)}
        primaryColor={palette.primary}
        shadowColor={palette.primaryShadow}
      />

      <AnimatePresence initial={false}>
        <TabContent palette={palette}>
          {FeatureFlags.isProfileLinksEnabled && (
            <StyledAnimatedTab selected={selectedTab === ProfileTab.Links}>
              <ProfileLinkSection
                isMyProfile={isMyProfile}
                blocks={profile?.links ?? null}
              />
            </StyledAnimatedTab>
          )}

          {/* <StyledAnimatedTab selected={selectedTab === ProfileTab.Questions}>
            <QuestionSection />
          </StyledAnimatedTab> */}

          <StyledAnimatedTab selected={selectedTab === ProfileTab.Wallets}>
            <ProfileWalletList wallets={wallets} />
          </StyledAnimatedTab>
          <StyledAnimatedTab selected={selectedTab === ProfileTab.Assets}>
            <AssetSection tokenBalances={tokenBalances} />
          </StyledAnimatedTab>
          <StyledAnimatedTab selected={selectedTab === ProfileTab.NFTs}>
            <NFTSection
              nftAssets={nftAssets}
              selected={selectedTab === ProfileTab.NFTs}
              isMyProfile={isMyProfile}
              profile={profile}
              onClickSetAsProfile={async (assetImage) => {
                try {
                  await axios.post(`/api/profile`, {
                    username: profile?.username.toLowerCase(),
                    display_name: profile?.display_name,
                    images: [assetImage],
                  });
                  revalidateProfile?.();

                  setTimeout(() => {
                    toast({
                      type: 'success',
                      title: 'Changes Saved',
                    });

                    document.body.scrollIntoView({
                      behavior: 'smooth',
                    });
                  });
                } catch (e) {
                  if (e instanceof AxiosError) {
                    const errorResponse = e.response?.data as ErrorResponse;
                    if (errorResponse?.code === 'USERNAME_UNUSABLE') {
                      toast({
                        type: 'error',
                        title: errorResponse.message,
                        description: 'Please choose another username',
                      });
                      setDraft((prev) => ({ ...prev, username: '' }));
                    } else if (errorResponse?.code === 'VALUE_REQUIRED') {
                      toast({
                        type: 'error',
                        title: errorResponse.message,
                      });
                    } else {
                      toast({
                        type: 'error',
                        title: 'Server Error',
                        description:
                          errorResponse?.message || 'Something went wrong',
                      });
                    }
                  }
                }
              }}
            />
          </StyledAnimatedTab>
        </TabContent>
      </AnimatePresence>

      {isMyProfile && (
        <FixedFooter
          onClickShare={() => {
            Analytics.logEvent('click_share_my_profile', {
              title: 'Share',
            });

            Analytics.logEvent('click_copy_profile_link', {
              user_id: profile?.user_id ?? '',
              username: profile?.username ?? '',
              is_my_profile: true,
            });
            copyToClipboard(`${window.location.origin}/u/${profile?.username}`);
            toast({
              title: 'Copied link to clipboard!',
              description: `Profile ${formatUsername(profile?.username)}`,
            });
          }}
        />
      )}
    </React.Fragment>
  );
};

type IsDefaultImageProps = {
  $isDefault: boolean;
};
const ProfileImageContainer = styled.div<IsDefaultImageProps>`
  width: 100%;
  padding-bottom: 100%;
  background-color: black;
  position: relative;
  aspect-ratio: 1;
  z-index: 0;
  overflow: hidden;

  &:after {
    content: '';
    width: 100%;
    height: 75%;

    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 25%, #000000 80%);
    z-index: 1;

    ${({ $isDefault }) =>
      $isDefault &&
      css`
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
      `};
  }
`;
const ProfileImage = styled.img<IsDefaultImageProps>`
  margin-top: -5%;
  width: 100%;
  height: 90%;
  object-fit: cover;
  user-select: none;

  position: absolute;
  background-color: black;

  ${({ $isDefault }) =>
    $isDefault &&
    css`
      margin-top: 0;
      width: 100%;
      height: 100%;
    `};
`;
const EarlyBentoBadge = styled.img`
  position: absolute;
  top: 20px;
  right: 20px;

  width: 120px;
  height: 120px;
  border-radius: 50%;

  filter: saturate(1.25) drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.6));
  user-select: none;
  transition: all 0.2s ease-in-out;

  @media (max-width: 32rem) {
    width: 100px;
    height: 100px;
  }

  @media (max-width: 320px) {
    top: 16px;
    right: 16px;
    width: 84px;
    height: 84px;
  }
`;

const Information = styled.div`
  position: absolute;
  left: 24px;
  right: 24px;
  bottom: 18px;

  display: flex;
  flex-direction: column;
  z-index: 2;
`;

const ProfileEditButton = styled.button`
  padding: 8px 12px;
  position: absolute;
  top: 20px;
  left: 16px;

  background-color: ${Colors.gray600};
  border-radius: 8px;
  outline: 2px solid rgba(255, 255, 255, 0.45);
  color: ${Colors.gray050};

  transition: all 0.2s ease-in-out;

  &:hover {
    opacity: 0.85;
  }
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

    ${({ palette }) => css`
      background-color: ${palette.primary};
      box-shadow: 0 8px 16px ${palette.primaryShadow};
      text-shadow: 2px 2px 4px ${palette.darkShadow};

      &:hover {
        background-color: ${palette.dark};
        box-shadow: 0 4px 16px ${palette.darkShadow};
        transform: scale(1.05);
      }
    `};
  }
`;

const StyledAnimatedTab = styled(AnimatedTab)`
  padding-bottom: 220px;
`;

const ProfileEditModal = styled(Modal)`
  .modal-container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
const ProfileEditContainer = styled.div`
  padding: 32px 16px;
  width: 80vw;
  max-width: ${500 * 0.8}px;

  border-radius: 8px;
  background-color: rgba(38, 43, 52, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  user-select: none;
`;
