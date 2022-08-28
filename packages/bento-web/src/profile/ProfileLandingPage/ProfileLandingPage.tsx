import axios, { AxiosError } from 'axios';
import { Head } from 'next/document';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { NoSSR } from '@/components/NoSSR';
import { PageContainer } from '@/components/PageContainer';
import { useSession } from '@/hooks/useSession';
import { Analytics } from '@/utils/analytics';
import { toast } from '@/utils/toast';

import {
  ProfileEditor,
  UserInformationDraft,
} from '../ProfileDetailPage/components/ProfileEditor';
import { useProfile } from '../ProfileDetailPage/hooks/useProfile';
import { FixedLoginNudge } from '../components/LoginNudge';
import { TickerCarousel } from '../components/TickerCarousel';
import { UserProfile } from '../types/UserProfile';

type ErrorResponse =
  | {
      code: 'USERNAME_UNUSABLE' | 'VALUE_REQUIRED' | string;
      message: string;
    }
  | undefined;

const EMPTY_DRAFT: UserInformationDraft = {
  username: '',
  displayName: '',
  bio: '',
};

const CTA_TITLE = {
  CREATE_YOUR_PROFILE: 'Create Your Profile',
  GOTO_YOUT_PROFILE: 'Go to your profile',
};

export default function ProfileLandingPage() {
  const router = useRouter();
  const { session } = useSession();
  const { profile, revaildateProfile } = useProfile({ type: 'MY_PROFILE' });
  const [isLoginRequired, setLoginRequired] = useState<boolean>(false);

  useEffect(() => {
    Analytics.logEvent('view_profile_landing', undefined);
  }, []);

  const hasUsername = !!profile?.username;
  const [isEditing, setEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<UserInformationDraft>(EMPTY_DRAFT);
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
      revaildateProfile?.();

      toast({
        type: 'success',
        title: 'Changes Saved',
      });

      router.push(`/u/${createdProfile.username}`);
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

  const onClickCreateProfile = useCallback(() => {
    if (!session) {
      Analytics.logEvent('click_profile_landing_login', {
        title: CTA_TITLE.CREATE_YOUR_PROFILE,
      });
      setLoginRequired(true);
      return;
    }
    if (!hasUsername) {
      // new user; setup user information
      Analytics.logEvent('click_profile_landing_create_your_profile', {
        title: CTA_TITLE.CREATE_YOUR_PROFILE,
      });
      setEditing(true);
    } else {
      Analytics.logEvent('click_profile_landing_goto_your_profile', {
        title: CTA_TITLE.GOTO_YOUT_PROFILE,
      });
      router.push(`/u/${profile.username}`);
    }
  }, [session, profile, hasUsername]);

  return (
    <Container>
      <Head>
        <meta
          key="og:image"
          property="og:image"
          content="https://bento.finance/assets/profile/og-image.png"
        />
        <meta
          key="twitter:image"
          property="twitter:image"
          content="https://bento.finance/assets/profile/og-image.png"
        />
      </Head>
      <StyledTickerCarousel className="mt-[64px]" />
      <StyledPageContainer className="pt-0 z-10">
        <Illust />

        <Title>
          <span>Web3 Profiles</span>
          {`\n`}
          <span>{` like never before`}</span>
        </Title>

        <ButtonContainer>
          <NoSSR>
            <CTAButton onClick={onClickCreateProfile}>
              {hasUsername
                ? CTA_TITLE.GOTO_YOUT_PROFILE
                : CTA_TITLE.CREATE_YOUR_PROFILE}
            </CTAButton>
            {!hasUsername && <CTABadge>Less than a minute</CTABadge>}
          </NoSSR>
        </ButtonContainer>

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

        <FixedLoginNudge visible={isLoginRequired} redirectTo="/profile" />
      </StyledPageContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const StyledTickerCarousel = styled(TickerCarousel)`
  width: 100vw;
  position: absolute;
  top: 0;
`;
const StyledPageContainer = styled(PageContainer)`
  & > div {
    align-items: center;
  }
`;

const Illust: React.FC = () => (
  <IllustContainer>
    <EarlyBentoBadgeShadow>
      <EarlyBentoBadge
        alt="2022 OG - Early Bento"
        src="/assets/profile/2022-early-bento.png"
        width={248 * 2}
        height={248 * 2}
        quality={100}
      />
    </EarlyBentoBadgeShadow>

    <UniswapBadgeContainer>
      <UniswapBadge />
    </UniswapBadgeContainer>
    <OsmosisBadgeContainer>
      <OsmosisBadge />
    </OsmosisBadgeContainer>

    <S1IllustContainer>
      <S1Illust />
    </S1IllustContainer>

    <RightStickerWrapper>
      <RightStickerContainer>
        <DefineYourselfStickerContainer>
          <DefineYourselfSticker />
        </DefineYourselfStickerContainer>
        <BuidlStickerTopContainer>
          <BuidlStickerTop />
        </BuidlStickerTopContainer>
        <BuidlStickerBottomContainer>
          <BuidlStickerBottom />
        </BuidlStickerBottomContainer>
        <StarStickerContainer>
          <StarSticker />
        </StarStickerContainer>
      </RightStickerContainer>
    </RightStickerWrapper>

    <ProfileStackWrapper>
      <ProfileStackContainer>
        <ProfileBentoContainer>
          <ProfileBento />
        </ProfileBentoContainer>
        <ProfileCloneXContainer>
          <ProfileCloneX />
        </ProfileCloneXContainer>
      </ProfileStackContainer>
    </ProfileStackWrapper>

    <ProfileMegamiContainer>
      <ProfileMegami />
    </ProfileMegamiContainer>
  </IllustContainer>
);

const IllustContainer = styled.div`
  margin-top: 164px;
  display: flex;
  height: 248px;
  width: 248px;
  position: relative;
  z-index: 0;
  filter: saturate(120%);

  * {
    user-select: none;
  }
`;
const EarlyBentoBadgeShadow = styled.div`
  width: 248px;
  height: 248px;
  border-radius: 50%;

  display: flex;
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.55);
`;
const EarlyBentoBadge = styled(Image)`
  border-radius: 50%;

  user-select: none;
  transition: all 0.2s ease-in-out;
`;

const RightStickerWrapper = styled.div`
  position: absolute;
  top: 10px;
  left: -352px;

  display: flex;
`;
const RightStickerContainer = styled.div`
  position: relative;
  width: 392.94px;
  height: 352.41px;
`;
const DefineYourselfStickerContainer = styled.div`
  width: 380px;
  height: 42px;

  position: absolute;
  top: 69.65px;
  left: -5.97px;
  z-index: -2;

  transform: rotate(-22deg);
  filter: drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.55))
    drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`;
const DefineYourselfSticker = styled(Image).attrs({
  src: '/assets/profile/sticker-define-yourself.png',
  width: 380,
  height: 42,
})``;

const BuidlStickerTopContainer = styled.div`
  width: 200.87px;
  height: 118.11px;

  position: absolute;
  top: 103.54px;
  left: 158.3px;
  z-index: 1;

  transform: rotate(14deg);

  filter: drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.55));
`;
const BuidlStickerTop = styled(Image).attrs({
  src: '/assets/profile/sticker-buidl-top.png',
  width: 200.87 * 2,
  height: 118.11 * 2,
  quality: 100,
})``;
const BuidlStickerBottomContainer = styled.div`
  width: 200.87px;
  height: 118.11px;

  position: absolute;
  top: 108.29px;
  left: 176.04px;
  z-index: -1;

  filter: drop-shadow(0px 8px 24px rgba(0, 0, 0, 0.55));
  transform: rotate(29deg);
`;
const BuidlStickerBottom = styled(Image).attrs({
  src: '/assets/profile/sticker-buidl-bottom.png',
  width: 200.87 * 2,
  height: 118.11 * 2,
})``;

const TOP_RIGHT_BLUR = 48;
const StarStickerContainer = styled.div`
  position: absolute;
  top: ${176 - TOP_RIGHT_BLUR}px;
  left: ${145 - TOP_RIGHT_BLUR}px;

  width: ${176.41 + TOP_RIGHT_BLUR}px;
  height: ${176.41 + TOP_RIGHT_BLUR}px;
`;
const StarSticker = styled(Image).attrs({
  src: '/assets/profile/sticker-star.png',
  width: 176.41 * 1.5,
  height: 176.41 * 1.5,
})``;

const UniswapBadgeContainer = styled.div`
  width: 125px;
  height: 125px;
  border-radius: 50%;

  position: absolute;
  top: 22.5px;
  right: -96.71px;
  transform: rotate(-20deg);
  z-index: 2;

  display: flex;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.55);
`;
const UniswapBadge = styled(Image).attrs({
  src: '/assets/profile/badge-uniswap.png',
  width: 125 * 2,
  height: 125 * 2,
  quality: 100,
})``;
const OsmosisBadgeContainer = styled.div`
  width: 98px;
  height: 98px;
  border-radius: 50%;

  position: absolute;
  top: ${22.5 + 44.5}px;
  right: ${-61 - 98}px;
  z-index: 2;

  display: flex;
  box-shadow: 0px 3px 9px rgba(0, 0, 0, 0.55);
`;
const OsmosisBadge = styled(Image).attrs({
  src: '/assets/profile/badge-osmosis.png',
  width: 98 * 2,
  height: 98 * 2,
  quality: 100,
})``;

const S1IllustContainer = styled.div`
  position: absolute;
  top: 136px;
  right: -164px;
  display: flex;
  z-index: -1;
`;
const S1Illust: React.FC = () => (
  <svg
    width="233"
    height="190"
    viewBox="0 0 233 190"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="41.5"
      y="0.5"
      width="185"
      height="185"
      rx="92.5"
      stroke="#EB4C5B"
    />
    <rect
      x="169.5"
      y="126.5"
      width="63"
      height="63"
      rx="31.5"
      fill="url(#paint0_linear_1072_286)"
      stroke="#EB4C5B"
    />
    <path
      d="M115.121 112.024C116.881 112.024 118.289 111.613 119.345 110.792C120.46 109.912 121.017 108.797 121.017 107.448C121.017 106.04 120.108 104.661 118.289 103.312C116.471 101.904 114.447 100.701 112.217 99.704C110.047 98.648 108.052 97.0933 106.233 95.04C104.415 92.9867 103.505 90.6107 103.505 87.912C103.505 83.7467 104.972 80.608 107.905 78.496C110.897 76.384 115.063 75.328 120.401 75.328C123.804 75.328 127.412 75.944 131.225 77.176C131.225 77.9973 131.225 79.4053 131.225 81.4C131.225 83.3947 131.049 85.8587 130.697 88.792C129.172 88.792 127.735 88.6453 126.385 88.352C126.503 87.648 126.561 86.9733 126.561 86.328C126.561 82.6907 124.655 80.872 120.841 80.872C119.492 80.872 118.348 81.2533 117.409 82.016C116.529 82.72 116.089 83.8053 116.089 85.272C116.089 86.68 117.028 88.0293 118.905 89.32C120.841 90.552 122.924 91.6373 125.153 92.576C127.441 93.456 129.524 94.952 131.401 97.064C133.337 99.176 134.305 101.728 134.305 104.72C134.305 108.592 132.575 111.819 129.113 114.4C125.711 116.923 121.399 118.184 116.177 118.184C110.956 118.184 106.468 117.627 102.713 116.512C102.655 115.28 102.625 113.667 102.625 111.672C102.625 109.619 102.772 107.067 103.065 104.016C104.239 104.016 105.764 104.133 107.641 104.368C107.641 104.544 107.641 105.072 107.641 105.952C107.641 106.832 107.847 107.8 108.257 108.856C108.727 109.912 109.46 110.675 110.457 111.144C111.807 111.731 113.361 112.024 115.121 112.024ZM167.648 112.024C167.707 112.376 167.736 112.963 167.736 113.784C167.736 114.605 167.59 115.691 167.296 117.04H137.2C137.2 116.629 137.2 115.955 137.2 115.016C137.2 114.077 137.376 113.08 137.728 112.024C140.544 111.731 142.686 111.232 144.152 110.528C145.619 109.765 146.352 108.533 146.352 106.832V71.28L137.728 72.688C137.67 72.2773 137.64 71.6907 137.64 70.928C137.64 70.1653 137.787 69.4907 138.08 68.904C145.179 64.4453 151.544 60.8373 157.176 58.08L159.992 59.224V110.264C161.928 111.144 164.48 111.731 167.648 112.024Z"
      fill="#EB4C5B"
    />
    <rect
      x="0.5"
      y="62.5"
      width="63"
      height="63"
      rx="31.5"
      fill="url(#paint1_linear_1072_286)"
      stroke="#EB4C5B"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1072_286"
        x1="201"
        y1="126"
        x2="201"
        y2="190"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF7E63" />
        <stop offset="1" stopColor="#E2264A" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_1072_286"
        x1="32"
        y1="62"
        x2="32"
        y2="126"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FF7E63" />
        <stop offset="1" stopColor="#E2264A" />
      </linearGradient>
    </defs>
  </svg>
);

const ProfileStackWrapper = styled.div`
  position: absolute;
  right: ${-85 - 557}px;
  z-index: 1;
`;
const ProfileStackContainer = styled.div`
  position: relative;
  width: 557px;
  height: 642px;

  &:after {
    content: '';
    position: absolute;
    width: 425px;
    height: 288px;
    left: 66px;
    top: 354px;

    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 78.12%);
  }
`;
const ProfileBentoContainer = styled.div`
  position: absolute;
  top: 90px;
  left: 169.69px;

  width: 236.66px;
  height: 512.46px;
  transform: rotate(12deg);
`;
const ProfileBento = styled(Image).attrs({
  src: '/assets/profile/profile-bento.png',
  width: 236.66 * 1.5,
  height: 512.46 * 1.5,
  quality: 100,
})``;
const ProfileCloneXContainer = styled.div`
  position: absolute;
  top: 24.46px;
  left: 69.57px;

  width: 264.34px;
  height: 572.38px;
  transform: rotate(-15deg);
  filter: drop-shadow(0px 8px 124px rgba(0, 0, 0, 0.88));
`;
const ProfileCloneX = styled(Image).attrs({
  src: '/assets/profile/profile-clonex.png',
  width: 264.34 * 1.5,
  height: 572.38 * 1.5,
  quality: 100,
})``;
const ProfileMegamiContainer = styled.div`
  position: absolute;
  top: 254px;
  left: ${-385.5 - 60}px;

  width: 385.54px;
  height: 834.83px;
  transform: rotate(-15deg);
  filter: drop-shadow(0px 11.6681px 180.856px rgba(0, 0, 0, 0.88));

  &:after {
    content: '';
    top: 320px;
    left: 0px;

    position: absolute;
    width: 594px;
    height: 586px;

    background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 55.82%);
  }
`;
const ProfileMegami = styled(Image).attrs({
  src: '/assets/profile/profile-megami.png',
  width: 385.54 * 1.5,
  height: 834.83 * 1.5,
  quality: 100,
})``;

const Title = styled.h1`
  width: fit-content;
  margin: 44px auto 0;

  font-weight: 900;
  font-size: 52px;
  font-variant: small-caps;
  line-height: 83%;

  text-align: center;
  letter-spacing: -0.5px;

  color: #ffffff;

  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;

  & > span {
    width: fit-content;
  }

  @media screen and (max-width: 620px) {
    font-size: 48px;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 32px;
  width: 352px;
  position: relative;
  z-index: 1;
`;
const CTAButton = styled(Button)`
  width: 100%;

  font-weight: 900;
  font-size: 18px;
  line-height: 120%;
`;
const CTABadge = styled.span`
  position: absolute;
  top: -12px;
  right: -52px;

  width: fit-content;
  padding: 6px 12px;
  background: rgba(51, 9, 17, 0.88);
  border: 1px solid #ff214a;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.44);
  border-radius: 36px;

  display: flex;
  justify-content: center;
  align-items: center;

  font-family: 'Raleway';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 83%;
  /* identical to box height, or 12px */

  text-align: center;
  letter-spacing: -0.5px;

  color: #ff214a;
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

  max-height: calc(100vh - 64px - 84px);
  overflow: scroll;

  border-radius: 8px;
  background-color: rgba(38, 43, 52, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: default;
  user-select: none;
`;
