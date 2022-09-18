import { MetaHead } from '@bento/client/components/MetaHead';
import { useSession } from '@bento/client/hooks/useSession';
import { walletsAtom } from '@bento/client/jotai/wallets';
import { Analytics } from '@bento/client/utils';
import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';

import { DashboardIntro } from './DashboardIntro';
import { TokenDetailModalParams } from './components/TokenDetailModal';

const DynamicDashboardMain = dynamic(() => import('./DashboardMain'));
const DynmaicAddWalletModal = dynamic(
  () => import('./components/AddWalletModal'),
);
const DynamicTokenDetailModal = dynamic(
  () => import('./components/TokenDetailModal'),
);

const DashboardPage = () => {
  const { session } = useSession();
  const wallets = useAtomValue(walletsAtom);

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);
  const [isTokenDetailModalVisible, setTokenDetailModalVisible] =
    useState<boolean>(false);
  const [tokenDetailModalParams, setTokenDetailModalParams] =
    useState<TokenDetailModalParams>({});

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  useEffect(() => setPageLoaded(true), []);

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
    if (!pageLoaded || hasLoggedViewEvent.current) {
      return;
    }

    if (!hasWallet) {
      return;
    } else {
      Analytics.logEvent('view_dashboard_main', undefined);
      hasLoggedViewEvent.current = true;
    }
  }, [pageLoaded, hasWallet]);

  return (
    <>
      <MetaHead />
      <Black />
      <PageContainer className="pt-0 z-10">
        {!pageLoaded ? null : !hasWallet ? (
          <DashboardIntro
            onConnectWallet={() => setAddWalletModalVisible((prev) => !prev)}
          />
        ) : (
          <DynamicDashboardMain
            wallets={wallets}
            setAddWalletModalVisible={setAddWalletModalVisible}
            setTokenDetailModalVisible={setTokenDetailModalVisible}
            setTokenDetailModalParams={setTokenDetailModalParams}
          />
        )}

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
