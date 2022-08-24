import { OpenSeaAsset } from '@bento/client';
import axios from 'axios';
import dedent from 'dedent';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import groupBy from 'lodash.groupby';
import React, { useCallback, useMemo, useState } from 'react';
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

import { AssetSection } from '../ProfileDetailPage/components/AssetSection';
import {
  ProfileEditor,
  UserInformationDraft,
} from '../ProfileDetailPage/components/ProfileEditor';
import { ProfileImage } from '../ProfileDetailPage/components/ProfileImage';
import { ProfileLinkSection } from '../ProfileDetailPage/components/ProfileLinkSection';
import { ProfileViewer } from '../ProfileDetailPage/components/ProfileViewer';
import { QuestionSection } from '../ProfileDetailPage/components/QuestionSection';
import { StickyTab } from '../ProfileDetailPage/components/StickyTab';
import { Palette, usePalette } from '../ProfileDetailPage/hooks/usePalette';
import { UserProfile } from '../types/UserProfile';

const data = {
  color: '#ff3856',
  background: dedent`
    linear-gradient(to right bottom, #E35252 0%, #DB6E57 29.47%, #C22E3A 65.1%)
  `,
};

enum ProfileTab {
  Links = 'Links',
  Questions = 'Questions',
  Assets = 'Assets',
  NFTs = 'NFTs',
}

const PROFILE_TABS = [
  ...(FeatureFlags.isProfileLinksEnabled ? [ProfileTab.Links] : []),
  ...(FeatureFlags.isProfileQuestionsEnabled ? [ProfileTab.Questions] : []),
  ProfileTab.Assets,
  ProfileTab.NFTs,
];

type ProfileInstanceProps = {
  profile?: UserProfile;
  revaildateProfile?: () => Promise<void>;
};

const walletBalanceReducer =
  (key: string, callback: (acc: number, balance: WalletBalance) => number) =>
  (acc: number, balance: WalletBalance) =>
    (balance.symbol ?? balance.name) === key ? callback(acc, balance) : acc;

export const ProfileInstance: React.FC<ProfileInstanceProps> = ({
  profile,
  revaildateProfile,
}) => {
  const [isProfileImageModalVisible, setProfileImageModalVisible] =
    useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<ProfileTab>(PROFILE_TABS[0]);

  const wallets = useRecoilValue(walletsAtom);
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

  const [isEditing, setEditing] = useState<Boolean>(false);

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
      <BackgroundGradient style={{ background: data.background }}>
        <ProfileImageContainer>
          <ClickableProfileImage
            source={profileImageURL}
            onClick={() => setProfileImageModalVisible((value) => !value)}
          />
        </ProfileImageContainer>
      </BackgroundGradient>
      <ProfileImageBottomSpacer />
      <Information>
        {!isEditing ? (
          <ProfileEditButton onClick={onProfileEdit}>
            Edit Profile
          </ProfileEditButton>
        ) : (
          <ProfileEditButton onClick={() => setEditing((prev) => !prev)}>
            Cancel
          </ProfileEditButton>
        )}

        {!isEditing ? (
          <ProfileViewer profile={profile} />
        ) : (
          <ProfileEditor
            draft={draft}
            setDraft={setDraft}
            onSubmit={onProfileEdit}
          />
        )}
      </Information>
      <InformationSpacer />
      <Modal
        visible={isProfileImageModalVisible}
        onDismiss={() => setProfileImageModalVisible((value) => !value)}
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
          {selectedTab === ProfileTab.Links && (
            <AnimatedTab>
              <ProfileLinkSection
                items={profile?.links ?? null}
                isEditing={isEditing}
              />
            </AnimatedTab>
          )}
          {selectedTab === ProfileTab.Questions && (
            <AnimatedTab>
              <QuestionSection isEditing={isEditing} />
            </AnimatedTab>
          )}
          {selectedTab === ProfileTab.Assets && (
            <AnimatedTab>
              <AssetSection
                tokenBalances={tokenBalances}
                isEditing={isEditing}
              />
            </AnimatedTab>
          )}
          {selectedTab === ProfileTab.NFTs && (
            <AnimatedTab>
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
          )}
        </TabContent>
      </AnimatePresence>
    </React.Fragment>
  );
};

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

const ProfileEditButton = styled.button.attrs({
  className:
    'w-fit p-1 px-3 text-slate-100/75 border-2 border-slate-100/75 rounded-2xl absolute top-[-24px] right-6 hover:opacity-50 transition-all',
})``;

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

const AnimatedTab = (props: HTMLMotionProps<'div'>) => (
  <motion.div
    initial={{ opacity: 0, transform: 'scale(0.9)' }}
    animate={{ opacity: 1, transform: 'scale(1)' }}
    exit={{ opacity: 0, transform: 'scale(0.9)' }}
    style={{ originY: 0, paddingBottom: 64 }}
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

  @media screen and (max-width: 36rem) {
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
