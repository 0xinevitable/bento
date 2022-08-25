import { OpenSeaAsset } from '@bento/client';
import { Wallet } from '@bento/common';
import axios from 'axios';
import dedent from 'dedent';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import groupBy from 'lodash.groupby';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled, { css } from 'styled-components';

import { Modal } from '@/components/Modal';
import { AssetMedia } from '@/dashboard/components/AssetMedia';
import { DashboardTokenBalance } from '@/dashboard/types/TokenBalance';
import { WalletBalance } from '@/dashboard/types/WalletBalance';
import { useNFTBalances } from '@/dashboard/utils/useNFTBalances';
import { useWalletBalances } from '@/dashboard/utils/useWalletBalances';
import { walletsAtom } from '@/recoil/wallets';
import { FeatureFlags } from '@/utils/FeatureFlag';
import { Supabase } from '@/utils/Supabase';

import { AssetSection } from '../ProfileDetailPage/components/AssetSection';
import { FixedFooter } from '../ProfileDetailPage/components/FixedFooter';
import {
  ProfileEditor,
  UserInformationDraft,
} from '../ProfileDetailPage/components/ProfileEditor';
// import { ProfileLinkSection } from '../ProfileDetailPage/components/ProfileLinkSection';
import { ProfileViewer } from '../ProfileDetailPage/components/ProfileViewer';
import { ProfileWalletList } from '../ProfileDetailPage/components/ProfileWalletList';
// import { QuestionSection } from '../ProfileDetailPage/components/QuestionSection';
import { StickyTab } from '../ProfileDetailPage/components/StickyTab';
import { Palette, usePalette } from '../ProfileDetailPage/hooks/usePalette';
import { UserProfile } from '../types/UserProfile';
import { TickerCarousel } from './TickerCarousel';

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
  profile?: UserProfile;
  revaildateProfile?: () => Promise<void>;
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
  revaildateProfile,
  isMyProfile = false,
}) => {
  const [isProfileImageModalVisible, setProfileImageModalVisible] =
    useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<ProfileTab>(PROFILE_TABS[0]);

  const myWalletsInState = useRecoilValue(walletsAtom);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  useEffect(() => {
    if (isMyProfile) {
      setWallets(myWalletsInState);
    } else if (!!profile?.user_id) {
      fetchWallets(profile.user_id)
        .then(setWallets)
        .catch(() => {
          setWallets([]);
        });
    }
  }, [isMyProfile, myWalletsInState, profile?.user_id]);

  const { balances: walletBalances } = useWalletBalances({ wallets });
  const { balances: nftBalances } = useNFTBalances({ wallets });

  const tokenBalances = useMemo<DashboardTokenBalance[]>(() => {
    // NOTE: `balance.symbol + balance.name` 로 키를 만들어 groupBy 하고, 그 결과만 남긴다.
    // TODO: 추후 `tokenAddress` 로만 그룹핑 해야 할 것 같다(같은 심볼과 이름을 사용하는 토큰이 여러개 있을 수 있기 때문).
    const balancesByPlatform = Object.entries(
      groupBy<WalletBalance>(
        [...walletBalances],
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
            (acc, balance) =>
              acc +
              balance.balance +
              ('delegations' in balance ? balance.delegations : 0),
          ),
          0,
        );

        return {
          platform: first.platform,
          symbol: first.symbol,
          name: first.name,
          logo: first.logo,
          type: 'type' in first ? first.type : undefined,
          tokenAddress: 'address' in first ? first.address : undefined,
          balances: balances,
          netWorth: amount * first.price,
          amount,
          price: first.price,
          coinGeckoId: 'coinGeckoId' in first ? first.coinGeckoId : undefined,
        };
      })
      .flat();

    tokens.sort((a, b) => b.netWorth - a.netWorth);
    return tokens.filter((v) => v.netWorth > 0);
  }, [walletBalances]);

  const nftAssets = useMemo<OpenSeaAsset[]>(
    () =>
      nftBalances?.flatMap((item) => ('assets' in item ? item.assets : [])) ??
      [],
    [nftBalances],
  );

  const palette = usePalette(data.color);
  const profileImageURL =
    profile?.images?.[0] ?? '/assets/mockups/profile-default.png';

  const [isEditing, setEditing] = useState<boolean>(false);

  const [draft, setDraft] = useState<UserInformationDraft>({
    username: '',
    displayName: '',
    bio: '',
  });
  const onProfileEdit = useCallback(async () => {
    if (!isEditing) {
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

    try {
      const { data } = await axios.post(`/api/profile`, {
        username: draft.username,
        display_name: draft.displayName,
        bio: draft.bio,
      });
      console.log(data);

      setEditing(false);
      revaildateProfile?.();
    } catch (e) {}
  }, [profile, isEditing, draft]);

  return (
    <React.Fragment>
      <TickerCarousel />

      <ProfileImageContainer>
        <ProfileImage src={profileImageURL} />

        {!!profile && (
          <EarlyBentoBadge
            alt="2022 OG - Early Bento"
            src="/assets/profile/2022-early-bento.png"
          />
        )}

        {isMyProfile && !isEditing && (
          <ProfileEditButton onClick={onProfileEdit}>
            Edit Profile
          </ProfileEditButton>
        )}

        <Information>
          <ProfileViewer profile={profile} />
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
          {/* <AnimatedTab selected={selectedTab === ProfileTab.Links}>
            <ProfileLinkSection
              items={profile?.links ?? null}
              isEditing={isEditing}
            />
          </AnimatedTab> */}

          {/* <AnimatedTab selected={selectedTab === ProfileTab.Questions}>
            <QuestionSection isEditing={isEditing} />
          </AnimatedTab> */}

          <AnimatedTab selected={selectedTab === ProfileTab.Wallets}>
            <ProfileWalletList wallets={wallets} />
          </AnimatedTab>
          <AnimatedTab selected={selectedTab === ProfileTab.Assets}>
            <AssetSection tokenBalances={tokenBalances} isEditing={isEditing} />
          </AnimatedTab>
          <AnimatedTab selected={selectedTab === ProfileTab.NFTs}>
            <AssetList>
              {nftAssets.map((asset) => {
                const isVideo =
                  !!asset.animation_url ||
                  asset.image_url.toLowerCase().endsWith('.mp4');

                return (
                  <AssetListItem key={asset.id}>
                    <AssetMedia
                      src={!isVideo ? asset.image_url : asset.animation_url}
                      poster={asset.image_url || asset.image_preview_url}
                      isVideo={isVideo}
                    />
                    <AssetName className="text-sm text-gray-400">
                      {asset.name || `#${asset.id}`}
                    </AssetName>
                  </AssetListItem>
                );
              })}
            </AssetList>
          </AnimatedTab>
        </TabContent>
      </AnimatePresence>

      {isMyProfile && <FixedFooter />}
    </React.Fragment>
  );
};

const ProfileImageContainer = styled.div`
  width: 100%;
  padding-bottom: 100%;
  background-color: red;
  position: relative;
  aspect-ratio: 1;
  z-index: 0;

  &:after {
    content: '';
    width: 100%;
    height: 75%;

    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;

    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
    z-index: 1;
  }
`;
const ProfileImage = styled.img`
  width: 100%;
  height: 100%;

  position: absolute;
  background-color: black;
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

  @media screen and (max-width: 32rem) {
    width: 100px;
    height: 100px;
  }

  @media screen and (max-width: 320px) {
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
  padding: 4px 12px;

  border-radius: 24px;
  border-width: 2px;

  position: absolute;
  top: 20px;
  left: 16px;

  color: rgb(241 245 249 / 0.75);
  border-color: rgb(241 245 249 / 0.75);
  transition: all 0.2s ease-in-out;

  :hover {
    opacity: 0.5;
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

type AnimatedTabProps = {
  selected: boolean;
};
const AnimatedTab = (props: AnimatedTabProps & HTMLMotionProps<'div'>) => (
  <motion.div
    animate={
      !props.selected
        ? { opacity: 0, transform: 'scale(0.9)' }
        : { opacity: 1, transform: 'scale(1)' }
    }
    style={{
      originY: 0,
      paddingBottom: 220,
      display: !props.selected ? 'none' : 'block',
    }}
    transition={{ duration: 0.35 }}
    {...props}
  />
);

// FIXME: Those are similar declares with `TokenDetailModal`
const AssetList = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const AssetListItem = styled.li`
  display: flex;
  flex-direction: column;

  width: calc((100% - 24px) / 3);

  @media screen and (max-width: 32rem) {
    width: calc((100% - 12px) / 2);
  }
`;
const AssetName = styled.span`
  margin-top: 4px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
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
