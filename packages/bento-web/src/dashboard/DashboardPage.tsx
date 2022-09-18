import { MetaHead } from '@bento/client/components/MetaHead';
import { useSession } from '@bento/client/hooks/useSession';
import { walletsAtom } from '@bento/client/recoil/wallets';
import { Analytics } from '@bento/client/utils/analytics';
import { useAtomValue } from 'jotai';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';

import { DashboardIntro } from './DashboardIntro';
import { AddWalletModal } from './components/AddWalletModal';
import {
  TokenDetailModal,
  TokenDetailModalParams,
} from './components/TokenDetailModal';

const DynamicDashboardMain = dynamic(() => import('./DashboardMain'));

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

        <AddWalletModal
          visible={isAddWalletModalVisible}
          onDismiss={() => setAddWalletModalVisible((prev) => !prev)}
        />
        <TokenDetailModal
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

const TOP_LEFT_BLUR = 262.9;
const TopLeftBlur = styled.img`
  position: absolute;
  top: 360px;
  left: 63px;

  margin: ${-TOP_LEFT_BLUR}px;
  width: ${280.42 + TOP_LEFT_BLUR * 2}px;
  height: ${280.42 + TOP_LEFT_BLUR * 2}px;
  z-index: -1;
  user-select: none;
`;
const TOP_RIGHT_BLUR = 256;
const TopRightBlur = styled.img`
  position: absolute;
  top: -35px;
  right: 64.48px;

  margin: ${-TOP_RIGHT_BLUR}px;
  width: ${402 + TOP_RIGHT_BLUR * 2}px;
  height: ${47 + TOP_RIGHT_BLUR * 2}px;
  z-index: -1;
  user-select: none;
`;
