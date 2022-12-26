import { Wallet } from '@bento/common';
import styled from '@emotion/styled';
import { deleteCookie } from 'cookies-next';
import { useTranslation } from 'next-i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';

import { Button } from '@/components/system';
import { useSession } from '@/hooks/useSession';

import { Breakpoints } from '@/dashboard/constants/breakpoints';
import { Colors } from '@/styles';

import { WalletList, walletCountStyle } from './WalletList';

type Props = {
  wallets: Wallet[];
  isMyProfile: boolean;
  onClickAddWallet: () => void;
  revalidateWallets?: () => Promise<Wallet[] | undefined>;
};

export const WalletListSection: React.FC<Props> = ({
  wallets,
  isMyProfile,
  onClickAddWallet,
  revalidateWallets,
}) => {
  const router = useRouter();
  const { session } = useSession();
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
            {isMyProfile ? (
              <AddWalletButton onClick={onClickAddWallet}>
                {t('Add Another')}
              </AddWalletButton>
            ) : !session ? (
              <AddWalletButton
                onClick={() => {
                  deleteCookie('supabase_auth_token', {
                    path: '/',
                  });
                  setTimeout(() => {
                    router.push('/home?login=open');
                  });
                }}
              >
                {t('Log In')}
              </AddWalletButton>
            ) : null}
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
            {isMyProfile ? (
              <AddWalletButton onClick={onClickAddWallet}>
                {t('Connect Wallet')}
              </AddWalletButton>
            ) : !session ? (
              <AddWalletButton
                onClick={() => {
                  deleteCookie('supabase_auth_token', {
                    path: '/',
                  });
                  setTimeout(() => {
                    router.push('/home?login=open');
                  });
                }}
              >
                {t('Log In')}
              </AddWalletButton>
            ) : null}
          </ButtonContainer>
        </>
      )}
    </Container>
  );
};

const Container = styled.div`
  min-width: 420px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: ${Breakpoints.Tablet}px) {
    min-width: unset;
    width: 100%;
  }
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
