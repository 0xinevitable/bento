import { ChainType, Wallet, shortenAddress } from '@bento/common';
import { OpenSeaAsset } from '@bento/core';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { PageContainer } from '@/components/PageContainer';
import { NoSSR } from '@/components/system';
import { useSession } from '@/hooks/useSession';
import { formatUsername } from '@/utils/format';

import { UserProfile } from '@/profile/types/UserProfile';
import { Analytics, FeatureFlags } from '@/utils';

import { DetailModalParams } from './components/DetailModal';
import { KlaytnNFTAsset } from './hooks/useKlaytnNFTs';

const DynamicDashboardMain = dynamic(() => import('./DashboardMain'));
const DynamicDetailModal = dynamic(() => import('./components/DetailModal'));
const DynamicNFTDetailModal = dynamic(() =>
  import('@/profile/instance/sections/NFTDetailModal').then(
    (module) => module.NFTDetailModal,
  ),
);

type Props = {
  walletType: ChainType;
  account: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context,
) => {
  if (!FeatureFlags.isSearchEnabled) {
    return { notFound: true };
  }
  const { walletType, account } = context.query;
  if (
    !walletType ||
    !account ||
    typeof walletType !== 'string' ||
    typeof account !== 'string'
  ) {
    return { notFound: true };
  }
  if (!['evm', 'cosmos-sdk', 'sealevel', 'solana'].includes(walletType)) {
    return { notFound: true };
  }
  return {
    props: {
      walletType: walletType as ChainType,
      account,
      ...(await serverSideTranslations(context.locale || 'en', [
        'common',
        'dashboard',
      ])),
    },
  };
};

const WalletDashboardPage = ({ walletType, account }: Props) => {
  const router = useRouter();
  const { session } = useSession();

  // FIXME: mocked profile
  const profile = useMemo<Omit<UserProfile, 'user_id'>>(() => {
    return {
      user_id: null,
      username: '',
      display_name: shortenAddress(account),
      avatar_url: null,
      bio: '',
      verified: false,
      images: [],
      tabs: [],
      links: [],
    };
  }, [account]);

  const wallets = useMemo<Wallet[]>(
    () => [
      {
        type: walletType,
        address: account,

        // FIXME: Use data from API->Adapters
        networks: (walletType === 'evm'
          ? ['ethereum', 'polygon', 'bnb', 'avalanche', 'klaytn', 'opensea']
          : walletType === 'cosmos-sdk'
          ? ['cosmos-hub', 'osmosis']
          : ['solana']) as any[],
        isVerified: false,
      },
    ],
    [walletType, account],
  );

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
      // Analytics.logEvent('view_dashboard_main', {
      //   user_id: profile.user_id,
      //   username: profile.username,
      // });
    }
  }, [hasWallet]);

  const isMyProfile = false;
  // const [isMyProfile, setMyProfile] = useState<boolean>(
  //   props.type === 'MY_PROFILE',
  // );
  // useEffect(() => {
  //   setMyProfile(session?.user?.id === profile.user_id);
  // }, [JSON.stringify(session)]);

  const [title, description, ogImageURL] = useMemo(() => {
    let _title: string = '';
    let _description: string = '';

    const formattedUsername = formatUsername(profile.username);
    const displayName = profile.display_name;

    if (!!displayName) {
      _title = `${displayName} (${formattedUsername}) | Bento`;
    } else {
      _title = `${formattedUsername} | Bento`;
    }

    _description = profile.bio ?? '';

    return [
      _title,
      _description,
      `https://dev-server.bento.finance/api/images/og/u/${formatUsername(
        profile.username,
        '',
      )}`,
    ];
  }, [profile]);

  const [selectedNFT, setSelectedNFT] = useState<
    OpenSeaAsset | KlaytnNFTAsset | null
  >(null);

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
        <NoSSR>
          <DynamicDashboardMain
            isMyProfile={isMyProfile}
            user={{
              id: '',
              email: '',
              username: 'unknown',
              displayName: 'unknown',
              profileImage: '',
              bio: '',
              wallets,
            }}
            // FIXME: Remove this
            setAddWalletModalVisible={() => {}}
            setDetailModalVisible={setDetailModalVisible}
            setDetailModalParams={setDetailModalParams}
            selectedNFT={selectedNFT}
            setSelectedNFT={setSelectedNFT}
          />
        </NoSSR>

        {/* <DynmaicAddWalletModal
          visible={isAddWalletModalVisible}
          onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
          revalidateWallets={revalidateWallets}
        /> */}
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
        />
      </PageContainer>
    </>
  );
};

export default WalletDashboardPage;

const Black = styled.div`
  width: 100%;
  height: 64px;
  background-color: rgba(0, 0, 0, 0.5);
`;
