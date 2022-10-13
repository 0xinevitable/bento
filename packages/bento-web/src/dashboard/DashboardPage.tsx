import { Wallet } from '@bento/common';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { MetaHead } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { useWalletContext } from '@/hooks/useWalletContext';

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

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const accessToken: string =
    (getCookie('supabase_auth_token', {
      req: context.req,
      res: context.res,
    }) as string) || '';
  const { user: userFromCookie } = await Supabase.auth.api.getUser(accessToken);

  const username = context.query.username as string | undefined;

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

  console.log({ username });

  let profile: UserProfile | null = null;
  const query = Supabase.from('profile') //
    .select('*')
    .eq('username', username.toLowerCase());
  const profiles: UserProfile[] = (await query).data ?? [];
  console.log({ profiles });
  if (profiles.length > 0) {
    profile = profiles[0];
  }

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
  // const { wallets } = useWalletContext();

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

  console.log({ wallets });

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

  return (
    <>
      <MetaHead />
      <Black />
      <PageContainer style={{ paddingTop: 0 }}>
        <DynamicDashboardMain
          wallets={wallets}
          profile={profile}
          revalidateProfile={async () => {}}
          setAddWalletModalVisible={setAddWalletModalVisible}
          setTokenDetailModalVisible={setTokenDetailModalVisible}
          setTokenDetailModalParams={setTokenDetailModalParams}
        />

        <DynmaicAddWalletModal
          visible={isAddWalletModalVisible}
          onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
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
