import { OpenSeaAsset } from '@bento/client';
import { Wallet } from '@bento/common';
import axios from 'axios';
import dedent from 'dedent';
import { AnimatePresence, HTMLMotionProps, motion } from 'framer-motion';
import groupBy from 'lodash.groupby';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled, { css, keyframes } from 'styled-components';

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
      <TickerContainer>
        <Tickers>
          <TickerItem />
          <TickerItem />
          <TickerItem />
          <TickerItem />
          <TickerItem />
          <TickerItem />
        </Tickers>
      </TickerContainer>
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

const TickerContainer = styled.div`
  width: 100%;
  height: 40px;
  background: #000000;

  display: flex;
  align-items: center;
  overflow: hidden;

  position: relative;
  z-index: 0;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 1;

    width: 40px;
    height: 40px;

    background: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, #000000 100%);
  }

  &:before {
    left: 0;
    transform: matrix(-1, 0, 0, 1, 0, 0);
  }

  &:after {
    right: 0;
  }
`;

const tickerSlide = keyframes`
  to {
    transform: translate3d(-55%, 0, 0);
  }
`;
const Tickers = styled.div`
  margin-bottom: -4px;

  display: flex;
  gap: 24px;

  white-space: nowrap;
  animation-timing-function: linear;
  animation: ${tickerSlide} 44s infinite;
  animation-direction: alternate;
`;
const TickerItem: React.FC = () => (
  <svg
    width="283"
    height="13"
    viewBox="0 0 283 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4.194 12.834H0V0.216H4.194V12.834ZM21.1448 6.534C21.1448 11.412 17.2568 12.834 13.9988 12.834H5.3228V0.234H13.9628C17.6348 0.234 21.1448 1.152 21.1448 6.534ZM9.5168 9.414H13.7108C15.7628 9.414 16.7528 8.136 16.7528 6.552C16.7528 4.986 15.9608 3.708 13.7108 3.708H9.5168V9.414ZM21.8672 12.834V0.216H35.8172V3.708H26.0612V4.824H35.1872V8.19H26.0612V9.342H35.8172V12.834H21.8672ZM52.8625 0.198001V12.834H47.1385L40.9465 5.22V12.834H36.7525V0.198001H42.5845L48.6685 7.686V0.198001H52.8625ZM53.856 4.392V0.198001H70.542V4.392H64.296V12.834H60.102V4.392H53.856ZM75.8776 12.834H71.6836V0.216H75.8776V12.834ZM77.0064 4.392V0.198001H93.6924V4.392H87.4464V12.834H83.2524V4.392H77.0064ZM102.88 4.572L106.138 0.198001H111.088L104.968 9.126V12.834H100.774V9.126L94.69 0.198001H99.64L102.88 4.572ZM116.467 12.888H112.039L116.881 0.288001H121.309L116.467 12.888ZM122.323 12.834V0.198001H135.859V4.05H126.517V5.274H133.825V8.982H126.517V12.834H122.323ZM136.86 12.834V0.198001H146.13C147.336 0.198001 151.584 0.360001 151.584 4.842C151.584 7.182 150.486 8.442 149.262 9.108L151.836 12.834L146.994 12.816L144.852 9.846H141.054V12.834H136.86ZM141.054 6.156H145.734C146.346 6.156 147.3 6.03 147.3 4.986C147.3 3.924 146.22 3.888 145.68 3.888H141.054V6.156ZM152.364 6.21C152.364 1.998 155.082 0 160.752 0C166.224 0 169.518 1.422 169.518 6.444C169.518 11.358 166.728 12.888 160.86 12.888C154.848 12.888 152.364 10.746 152.364 6.21ZM156.972 6.444C156.972 8.28 158.214 9.576 160.914 9.576C163.362 9.576 164.91 8.622 164.91 6.444C164.91 4.356 163.218 3.312 160.86 3.312C158.214 3.312 156.972 4.482 156.972 6.444ZM184.315 7.272L181.057 12.834H177.601L174.505 7.308V12.834H170.311V0.198001H175.297L179.383 7.2L183.487 0.198001H188.491V12.834H184.315V7.272ZM193.881 12.888H189.453L194.295 0.288001H198.723L193.881 12.888ZM212.445 5.832C213.363 6.12 214.515 6.966 214.515 9.306C214.515 11.556 213.651 12.834 210.177 12.834H203.283H199.737V0.216L208.719 0.198001C212.175 0.198001 213.327 1.332 213.327 3.366C213.327 4.644 212.967 5.4 212.445 5.832ZM208.665 3.708H203.949V4.932H208.665C209.007 4.932 209.277 4.644 209.277 4.32C209.277 3.978 209.007 3.708 208.665 3.708ZM203.949 9.36H210.105C210.447 9.36 210.717 9.072 210.717 8.73C210.717 8.388 210.447 8.118 210.105 8.118H203.949V9.36ZM215.648 12.834V0.216H229.598V3.708H219.842V4.824H228.968V8.19H219.842V9.342H229.598V12.834H215.648ZM246.644 0.198001V12.834H240.92L234.728 5.22V12.834H230.534V0.198001H236.366L242.45 7.686V0.198001H246.644ZM247.637 4.392V0.198001H264.323V4.392H258.077V12.834H253.883V4.392H247.637ZM264.917 6.21C264.917 1.998 267.635 0 273.305 0C278.777 0 282.071 1.422 282.071 6.444C282.071 11.358 279.281 12.888 273.413 12.888C267.401 12.888 264.917 10.746 264.917 6.21ZM269.525 6.444C269.525 8.28 270.767 9.576 273.467 9.576C275.915 9.576 277.463 8.622 277.463 6.444C277.463 4.356 275.771 3.312 273.413 3.312C270.767 3.312 269.525 4.482 269.525 6.444Z"
      fill="#EB4C5B"
    />
  </svg>
);

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
