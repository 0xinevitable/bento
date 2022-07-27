import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import MetaHead from '@/components/MetaHead';
import { PageContainer } from '@/components/PageContainer';
import { walletsAtom } from '@/recoil/wallets';
import { Analytics } from '@/utils/analytics';

import { AddWalletModal } from './components/AddWalletModal';
import {
  TokenDetailModal,
  TokenDetailModalParams,
} from './components/TokenDetailModal';
import { IntroSection } from './sections/IntroSection';

const DynamicDashboardMain = dynamic(() => import('./sections/DashboardMain'));

const DashboardPage = () => {
  const wallets = useRecoilValue(walletsAtom);

  const [isAddWalletModalVisible, setAddWalletModalVisible] =
    useState<boolean>(false);
  const [isTokenDetailModalVisible, setTokenDetailModalVisible] =
    useState<boolean>(false);
  const [tokenDetailModalParams, setTokenDetailModalParams] =
    useState<TokenDetailModalParams>({});

  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  useEffect(() => setPageLoaded(true), []);

  const hasWallet = wallets.length > 0;

  useEffect(() => {
    Analytics.logEvent('view_dashboard_tab', undefined);
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
    <PageContainer className="pt-0 z-10">
      <MetaHead />
      <TopLeftBlur src="/assets/blurs/top-left.png" />
      <TopRightBlur src="/assets/blurs/top-right.png" />

      {!pageLoaded ? null : !hasWallet ? (
        <IntroSection
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
  );
};

export default DashboardPage;

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
