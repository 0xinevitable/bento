import { OpenSea, OpenSeaAsset } from '@bento/client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { PageContainer } from '@/components/PageContainer';
import { WalletConnector } from '@/components/WalletConnector';
import { WalletList } from '@/dashboard/components/WalletList';
import { FieldInput } from '@/profile/components/FieldInput';

import { OpenSeaAssetItem } from './components/OpenSeaAssetItem';

declare global {
  interface Window {
    keplr: any;
    klaytn: any;
    solana: any;
  }
}

const OnboardingPage: React.FC = () => {
  // FIXME: Replace hardcoded wallet address
  const HARDCODED_WALLET = '0x7777777141f111cf9f0308a63dbd9d0cad3010c4';
  const [openSeaAssets, setOpenSeaAssets] = useState<OpenSeaAsset[]>([]);

  useEffect(() => {
    OpenSea.getAssets({ owner: HARDCODED_WALLET })
      .then(({ assets }) => {
        setOpenSeaAssets(assets);
      })
      .catch(console.error);
  }, []);

  return (
    <PageContainer>
      <FieldInput field="Username" />

      <WalletConnector />
      <WalletList />

      <OpenSeaAssetList>
        {openSeaAssets.map((asset) => (
          <OpenSeaAssetItem key={asset.id} asset={asset} />
        ))}
      </OpenSeaAssetList>
    </PageContainer>
  );
};

export default OnboardingPage;

const OpenSeaAssetList = styled.ul`
  display: flex;
  flex-wrap: wrap;
`;
