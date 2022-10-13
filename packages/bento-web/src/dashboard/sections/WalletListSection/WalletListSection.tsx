import { Wallet } from '@bento/common';
import { useTranslation } from 'next-i18next';
import Image from 'next/future/image';
import styled from 'styled-components';

import { Button } from '@/components/system';

import { Colors } from '@/styles';

import { WalletList, walletCountStyle } from './WalletList';

type Props = {
  wallets: Wallet[];
  isMyProfile: boolean;
  onClickAddWallet: () => void;
  revalidateWallets: () => Promise<Wallet[] | undefined>;
};

export const WalletListSection: React.FC<Props> = ({
  wallets,
  isMyProfile,
  onClickAddWallet,
  revalidateWallets,
}) => {
  const { t } = useTranslation('common');

  return (
    <Container>
      <SectionTitleContainer>
        <SectionTitle>{t('Wallets')}</SectionTitle>
      </SectionTitleContainer>

      {wallets.length > 0 ? (
        <>
          <WalletList wallets={wallets} revalidateWallets={revalidateWallets} />
          <ButtonContainer>
            {isMyProfile && (
              <AddWalletButton onClick={onClickAddWallet}>
                {t('Add Another')}
              </AddWalletButton>
            )}
          </ButtonContainer>
        </>
      ) : (
        <>
          <Illust
            alt=""
            src="/assets/illusts/wallet.png"
            width={128}
            height={128}
            quality={100}
          />
          <EmptyContainer>
            <div>
              <span>
                {t('Wallets Connected')}&nbsp;&nbsp;
                <span className="total">{wallets.length}</span>
              </span>
            </div>
          </EmptyContainer>

          <ButtonContainer>
            <AddWalletButton onClick={onClickAddWallet}>
              {t('Connect Wallet')}
            </AddWalletButton>
          </ButtonContainer>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SectionTitleContainer = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;

  background-image: linear-gradient(
    to bottom,
    ${Colors.black} 40%,
    transparent
  );
`;
const SectionTitle = styled.h3`
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 24px;
  line-height: 100%;
  letter-spacing: -0.5px;
  color: ${Colors.gray400};
`;

export const ButtonContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: center;
`;

// FIXME: Design component
export const AddWalletButton = styled(Button)`
  && {
    height: unset;
    padding: 12px 18px;

    font-weight: 800;
    font-size: 14px;
    line-height: 100%;
    text-align: center;
    color: ${Colors.white};
  }
`;

const Illust = styled(Image)`
  margin: 24px auto;
  filter: saturate(120%);
`;
const EmptyContainer = styled.div`
  ${walletCountStyle}
`;
