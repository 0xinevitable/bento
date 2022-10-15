import { Wallet } from '@bento/common';
import { User } from '@supabase/supabase-js';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { MetaHead } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { getServerSupabase } from '@/utils/ServerSupabase';

import { UserProfile } from '@/profile/types/UserProfile';
import { Analytics, Supabase } from '@/utils';

import { TokenDetailModalParams } from './components/TokenDetailModal';

const DynamicDashboardMain = dynamic(() => import('./DashboardMain'));
const DynmaicAddWalletModal = dynamic(
  () => import('./components/AddWalletModal'),
);
const DynamicTokenDetailModal = dynamic(
  () => import('./components/TokenDetailModal'),
);

type Props =
  | {
      type: 'MY_PROFILE';
      profile: UserProfile;
    }
  | {
      type: 'USER_PROFILE';
      profile: UserProfile;
    };

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const getKoreanTimestring = (timestamp: string) => {
  const curr = new Date(timestamp);
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  return format(new Date(utc + KR_TIME_DIFF), 'yyyy-MM-dd HH:mm:ss');
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const notifySlack = async (user: User, profile: UserProfile) => {
  if (!process.env.SLACK_NEW_PROFILE_WEBHOOK) {
    // disabled
    return;
  }

  const provider = user.app_metadata.provider;
  await axios
    .post(process.env.SLACK_NEW_PROFILE_WEBHOOK, {
      provider: capitalize(provider || 'none'),
      social_url: !provider
        ? 'No social link available'
        : provider === 'twitter'
        ? `https://twitter.com/${user.user_metadata.user_name}`
        : `https://github.com/${user.user_metadata.user_name}`,
      user_id: user.id,
      profile_url: `https://www.bento.finance/u/${profile.username}`,
      joined_at: getKoreanTimestring(user.created_at),
    })
    .catch((e) => {
      console.error('[Slack] Failed to send webhook', e);
    });
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const Supabase = getServerSupabase();
  const accessToken: string =
    (getCookie('supabase_auth_token', {
      req: context.req,
      res: context.res,
    }) as string) || '';
  const username = context.query.username as string | undefined;

  if (username && username.length >= 36) {
    const userId = username;
    const query = Supabase.from('profile')
      .select('*')
      .eq('user_id', userId.toLowerCase());
    const profiles: UserProfile[] = (await query).data ?? [];
    const profile = profiles[0];

    if (!profile) {
      const { data: user, error: e } = await Supabase.auth.api.getUserById(
        userId,
      );
      if (!user) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      const displayName =
        user.identities?.[0]?.identity_data?.user_name ||
        user.user_metadata.user_name ||
        '';

      const data = await Supabase.from('profile').upsert({
        user_id: userId,
        username: userId,
        display_name: displayName,
        bio: '',
      });

      if (!!data.error) {
        console.log({ error: data.error });
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      const newProfile = {
        user_id: userId,
        username: userId,
        display_name: displayName,
        bio: '',
        images: [],
        verified: false,
        tabs: [],
        links: [],
      };
      try {
        await notifySlack(user, newProfile);
      } catch (error) {
        console.error(error);
      }

      return {
        props: {
          type: 'USER_PROFILE',
          profile: newProfile,
          ...(await serverSideTranslations(context.locale || 'en', [
            'common',
            'dashboard',
          ])),
        },
      };
    }
    return {
      props: {
        type: 'USER_PROFILE',
        profile,
        ...(await serverSideTranslations(context.locale || 'en', [
          'common',
          'dashboard',
        ])),
      },
    };
  }

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

  const { user: userFromCookie } = await Supabase.auth.api.getUser(accessToken);

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

const fetchWallets = async (userId: string): Promise<Wallet[]> => {
  const walletQuery = await Supabase.from('wallets')
    .select('*')
    .eq('user_id', userId);
  return walletQuery.data ?? [];
};

const DashboardPage = ({ profile, ...props }: Props) => {
  const { session } = useSession();

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const revalidateWallets = useCallback(async () => {
    try {
      const wallets = await fetchWallets(profile.user_id);
      setWallets(wallets);
    } catch {
      setWallets([]);
    }
    return wallets;
  }, [profile.user_id]);

  useEffect(() => {
    revalidateWallets();
  }, [revalidateWallets]);

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);
  const [isTokenDetailModalVisible, setTokenDetailModalVisible] =
    useState<boolean>(false);
  const [tokenDetailModalParams, setTokenDetailModalParams] =
    useState<TokenDetailModalParams>({});

  const hasWallet = !!session && wallets.length > 0;

  const hasLoggedTabViewEvent = useRef<boolean>(false);
  useEffect(() => {
    if (!hasLoggedTabViewEvent.current) {
      Analytics.logEvent('view_dashboard_tab', undefined);
    }
    hasLoggedTabViewEvent.current = true;
  }, []);

  const hasLoggedViewEvent = useRef<boolean>(false);
  useEffect(() => {
    if (!session) {
      return;
    } else {
      Analytics.logEvent('view_dashboard_main', undefined);
      hasLoggedViewEvent.current = true;
    }
  }, [hasWallet]);

  const [isMyProfile, setMyProfile] = useState<boolean>(
    props.type === 'MY_PROFILE',
  );
  useEffect(() => {
    setMyProfile(session?.user?.id === profile.user_id);
  }, [JSON.stringify(session)]);

  return (
    <>
      <MetaHead />
      <Black />
      <PageContainer style={{ paddingTop: 0 }}>
        <DynamicDashboardMain
          isMyProfile={isMyProfile}
          wallets={wallets}
          profile={profile}
          revalidateProfile={async () => {}}
          revalidateWallets={revalidateWallets}
          setAddWalletModalVisible={setAddWalletModalVisible}
          setTokenDetailModalVisible={setTokenDetailModalVisible}
          setTokenDetailModalParams={setTokenDetailModalParams}
        />

        <DynmaicAddWalletModal
          visible={isAddWalletModalVisible}
          onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
          revalidateWallets={revalidateWallets}
        />
        <DynamicTokenDetailModal
          visible={isTokenDetailModalVisible}
          onDismiss={() => {
            setTokenDetailModalVisible((prev) => !prev);
            setTokenDetailModalParams({});
          }}
          {...tokenDetailModalParams}
        />
      </PageContainer>
    </>
  );
};

export default DashboardPage;

const Black = styled.div`
  width: 100%;
  height: 64px;
  background-color: rgba(0, 0, 0, 0.5);
`;
