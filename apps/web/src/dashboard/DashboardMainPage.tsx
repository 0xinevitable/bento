import { BentoUser, BentoUserResponse, Wallet } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import styled from '@emotion/styled';
import { User } from '@supabase/supabase-js';
import axios, { AxiosError } from 'axios';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { PageContainer } from '@/components/PageContainer';
import { useSession } from '@/hooks/useSession';
import { formatUsername } from '@/utils/format';

import { ErrorResponse } from '@/profile/types/api';
import { Analytics, Supabase, axiosWithCredentials, toast } from '@/utils';

import { DetailModalParams } from './components/DetailModal';
import { KlaytnNFTAsset } from './hooks/useKlaytnNFTs';

const DynamicDashboardMain = dynamic(() => import('./DashboardMain'));
const DynmaicAddWalletModal = dynamic(
  () => import('./components/AddWalletModal'),
);
const DynamicDetailModal = dynamic(() => import('./components/DetailModal'));
const DynamicNFTDetailModal = dynamic(() =>
  import('@/profile/instance/sections/NFTDetailModal').then(
    (module) => module.NFTDetailModal,
  ),
);

type Props = { user: BentoUser };

const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
const getKoreanTimestring = (timestamp: string) => {
  const curr = new Date(timestamp);
  const utc = curr.getTime() + curr.getTimezoneOffset() * 60 * 1000;
  return format(new Date(utc + KR_TIME_DIFF), 'yyyy-MM-dd HH:mm:ss');
};

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const notifySlack = async (user: User, username: string) => {
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
      profile_url: `https://www.bento.finance/u/${username}`,
      joined_at: getKoreanTimestring(user.created_at),
    })
    .catch((e) => {
      console.error('[Slack] Failed to send webhook', e);
    });
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  const username =
    typeof context.query.username === 'string' ? context.query.username : '';
  if (!username) {
    return { notFound: true };
  }

  const { data } = await axios
    .get<BentoUserResponse>(`http://bentoapi.io/users/${username}`)
    .catch((e) => {
      console.error(e);
      return { data: null };
    });
  const user = data?.result;

  if (!user) {
    const { data: supabaseUser } = await Supabase.auth.api.getUserById(
      username,
    );
    if (!supabaseUser) {
      return { notFound: true };
    }

    const displayName =
      supabaseUser.identities?.[0]?.identity_data?.user_name ||
      supabaseUser.user_metadata.user_name ||
      '';

    const userId = supabaseUser.id;
    const initialProfile = {
      user_id: userId,
      username: userId,
      display_name: displayName,
      bio: '',
    };

    const upsertResult = await Supabase.from('profile').upsert(initialProfile);
    if (upsertResult.error) {
      console.error(upsertResult.error);
      return { notFound: true };
    }

    try {
      await notifySlack(supabaseUser, initialProfile.username);
    } catch (e) {
      console.error(e);
    }

    const { data } = await axios
      .get<BentoUserResponse>(`http://bentoapi.io/users/${username}`)
      .catch((e) => {
        console.error(e);
        return { data: null };
      });
    const user = data?.result;
    if (!user) {
      return { notFound: true };
    }

    return {
      props: {
        user,
        ...(await serverSideTranslations(context.locale || 'en', [
          'common',
          'dashboard',
        ])),
      },
    };
  }

  return {
    props: {
      user,
      ...(await serverSideTranslations(context.locale || 'en', [
        'common',
        'dashboard',
      ])),
    },
  };
};

const DashboardPage = (props: Props) => {
  const router = useRouter();
  const { session } = useSession();
  const [bentoUser, setBentoUser] = useState<BentoUser>(props.user);

  // const [wallets, setWallets] = useState<Wallet[]>([]);
  const revalidate = useCallback(async () => {
    FIXME: try {
      const { data } = await axios
        .get<BentoUserResponse>(`http://bentoapi.io/users/${bentoUser.id}`)
        .catch((e) => {
          console.error(e);
          return { data: null };
        });
      if (data?.result) {
        const user = data?.result;
        setBentoUser(user);
        return user.wallets;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  }, [bentoUser.id]);

  const wallets = bentoUser.wallets;

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);
  const [isDetailModalVisible, setDetailModalVisible] =
    useState<boolean>(false);
  const [detailModalParams, setDetailModalParams] = useState<DetailModalParams>(
    {},
  );

  const hasWallet = !!session && wallets.length > 0;

  const hasLoggedTabViewEvent = useRef<boolean>(false);
  useEffect(() => {
    if (!hasLoggedTabViewEvent.current) {
      Analytics.logEvent('view_dashboard_tab', undefined);
    }
    hasLoggedTabViewEvent.current = true;
  }, []);

  useEffect(() => {
    if (!session) {
      return;
    } else {
      Analytics.logEvent('view_dashboard_main', {
        user_id: bentoUser.id,
        username: bentoUser.username,
      });
    }
  }, [hasWallet, bentoUser.id, bentoUser.username]);

  // FIXME:
  const [isMyProfile, setMyProfile] = useState<boolean>(false);
  useEffect(() => {
    setMyProfile(session?.user?.id === bentoUser.id);
  }, [JSON.stringify(session)]);

  const [title, description, ogImageURL] = useMemo(() => {
    let _title: string = '';
    let _description: string = '';

    const formattedUsername = formatUsername(bentoUser.username);
    const displayName = bentoUser.displayName;

    if (!!displayName) {
      _title = `${displayName} (${formattedUsername}) | Bento`;
    } else {
      _title = `${formattedUsername} | Bento`;
    }

    _description = bentoUser.bio ?? '';

    return [
      _title,
      _description,
      `https://dev-server.bento.finance/api/images/og/u/${formatUsername(
        bentoUser.username,
        '',
      )}`,
    ];
  }, [bentoUser]);

  const [selectedNFT, setSelectedNFT] = useState<
    OpenSeaAsset | KlaytnNFTAsset | null
  >(null);

  const onClickSetAsProfile = useCallback(
    async (assetImage: string) => {
      try {
        await axiosWithCredentials.post(`/api/profile`, {
          username: bentoUser.username.toLowerCase(),
          display_name: bentoUser.displayName,
          images: [assetImage],
        });
        revalidate();

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
    },
    [revalidate],
  );

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta key="title" name="title" content={title} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="twitter:title" name="twitter:title" content={title} />

        <link
          key="canonical"
          rel="canonical"
          href={`https://bento.finance${router.asPath.split('?')[0]}`}
        />

        {description.length > 0 && (
          <>
            <meta key="description" name="description" content={description} />
            <meta
              key="og:description"
              property="og:description"
              content={description}
            />
            <meta
              key="twitter:description"
              name="twitter:description"
              content={description}
            />
          </>
        )}

        {ogImageURL && (
          <>
            <meta key="og:image" property="og:image" content={ogImageURL} />
            <meta
              key="twitter:image"
              property="twitter:image"
              content={ogImageURL}
            />
          </>
        )}
      </Head>

      <Black />
      <PageContainer style={{ paddingTop: 0 }}>
        <DynamicDashboardMain
          isMyProfile={isMyProfile}
          user={bentoUser}
          // imageToken={imageToken}
          revalidateWallets={revalidate}
          setAddWalletModalVisible={setAddWalletModalVisible}
          setDetailModalVisible={setDetailModalVisible}
          setDetailModalParams={setDetailModalParams}
          selectedNFT={selectedNFT}
          setSelectedNFT={setSelectedNFT}
        />

        <DynmaicAddWalletModal
          visible={isAddWalletModalVisible}
          onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
          revalidateWallets={revalidate}
        />
        <DynamicDetailModal
          visible={isDetailModalVisible}
          onDismiss={() => {
            setDetailModalVisible((prev) => !prev);
            setDetailModalParams({});
          }}
          // selectedNFT={selectedNFT}
          setSelectedNFT={setSelectedNFT}
          {...detailModalParams}
        />

        <DynamicNFTDetailModal
          asset={selectedNFT}
          visible={!!selectedNFT}
          onDismiss={() => setSelectedNFT(null)}
          isMyProfile={isMyProfile}
          onClickSetAsProfile={(assetImage) => {
            if (!bentoUser || !selectedNFT) {
              return;
            }
            Analytics.logEvent('set_nft_as_profile', {
              user_id: bentoUser.id ?? '',
              username: bentoUser.username ?? '',
              is_my_profile: isMyProfile,
              token_network:
                'network' in selectedNFT && selectedNFT.network === 'klaytn'
                  ? 'klaytn'
                  : 'ethereum',
              token_contract: selectedNFT.asset_contract.address,
              token_id: selectedNFT.token_id,
              medium: 'dashboard_main',
            });
            onClickSetAsProfile(assetImage);
          }}
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
