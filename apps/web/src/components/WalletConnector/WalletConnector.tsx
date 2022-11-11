import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { useCallback, useMemo, useState } from 'react';

import { useSignOut } from '@/hooks/useSignOut';
import { withAttrs } from '@/utils/withAttrs';

import { WALLETS } from '@/constants/wallets';
import { Colors } from '@/styles';
import { toast } from '@/utils';

import { ActivityIndicator } from '../system';
import {
  connectKaikas,
  connectKeplr,
  connectMetaMaskOrWalletConnect,
  connectPhantom,
} from './connectors';
import { NetworkDraft } from './types';

declare global {
  interface Window {
    keplr: any;
    klaytn: any;
    solana: any;
  }
}

type WalletType = 'metamask-or-walletconnect' | 'kaikas' | 'keplr' | 'phantom';

type WalletSelectorProps = {
  networks?: NetworkDraft[];
  onSave?: () => void;
};
export const WalletConnector: React.FC<WalletSelectorProps> = ({
  networks,
  onSave,
}) => {
  const { t } = useTranslation('common');
  const networksJSONKey = JSON.stringify(networks);

  const firstNetwork = useMemo(() => {
    if (!networks || networks.length === 0) {
      return undefined;
    }
    return networks[0].type;
  }, [networksJSONKey]);

  const { signOut } = useSignOut();

  const [isLoading, setLoading] = useState<boolean>(false);
  const onClickConnect = useCallback(
    async (walletType: WalletType) => {
      if (!networks || isLoading) {
        return;
      }

      setLoading(true);

      try {
        const props = {
          networks,
          signOut,
          onSave,
        };

        switch (walletType) {
          case 'metamask-or-walletconnect':
            await connectMetaMaskOrWalletConnect(props);
            break;
          case 'kaikas':
            await connectKaikas(props);
            break;
          case 'keplr':
            await connectKeplr(props);
            break;
          case 'phantom':
            await connectPhantom(props);
            break;
          default:
            break;
        }

        toast({
          type: 'success',
          title: 'Wallet Connected!',
        });
      } catch (error: any) {
        const typedError = error as Error;
        console.error(typedError);
        let errorMessage = typedError?.message || 'Unknown Error';
        if (errorMessage.length >= 120) {
          errorMessage = errorMessage.substring(0, 120) + '...';
        }
        toast({
          type: 'error',
          title: 'Ownership Verification Failed',
          description: errorMessage,
        });
      }

      setLoading(false);
    },
    [isLoading, networksJSONKey, signOut, onSave],
  );

  return (
    <WalletList>
      <WalletButton
        disabled={firstNetwork !== 'evm' || isLoading}
        onClick={
          firstNetwork === 'evm' && !isLoading
            ? () => onClickConnect('metamask-or-walletconnect')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.MetaMask} alt={t('MetaMask')} />
          <img src={WALLETS.WalletConnect} alt={t('WalletConnect')} />
        </IconList>
        <span className="title">
          {`${t('MetaMask')}/${t('WalletConnect')}`}
        </span>
      </WalletButton>

      <WalletButton
        disabled={firstNetwork !== 'evm' || isLoading}
        onClick={
          firstNetwork === 'evm' && !isLoading
            ? () => onClickConnect('kaikas')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Kaikas} alt={t('Kaikas')} />
        </IconList>
        <span className="title">{t('Kaikas')}</span>
      </WalletButton>

      <WalletButton
        disabled={firstNetwork !== 'cosmos-sdk' || isLoading}
        onClick={
          firstNetwork === 'cosmos-sdk' && !isLoading
            ? () => onClickConnect('keplr')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Keplr} alt={t('Keplr')} />
        </IconList>
        <span className="title">{t('Keplr')}</span>
      </WalletButton>

      <WalletButton
        disabled={firstNetwork !== 'sealevel' || isLoading}
        onClick={
          firstNetwork === 'sealevel' && !isLoading
            ? () => onClickConnect('phantom')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Phantom} alt={t('Phantom')} />
        </IconList>
        <span className="title">{t('Phantom')}</span>
      </WalletButton>

      <AnimatePresence>
        {isLoading && (
          <LoadingContainer
            {...{
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              transition: { ease: 'linear' },
            }}
          >
            <ActivityIndicator size={56} borderSize={8} />
          </LoadingContainer>
        )}
      </AnimatePresence>
    </WalletList>
  );
};

const WalletList = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

type WalletButtonProps = {
  disabled?: boolean;
};
const WalletButton = styled.button<WalletButtonProps>`
  padding: 16px;

  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;

  border-radius: 8px;
  background-color: ${Colors.gray600};

  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 20%;
      cursor: not-allowed;
    `};

  &:first-of-type {
    min-width: 240px;
  }

  * {
    transition: all 0.4s ease;
  }

  & > .title {
    font-weight: bold;
    color: ${Colors.gray200};
  }

  &:hover {
    background-color: ${Colors.gray500};

    & > .icon-list {
      transform: translateY(-2px);
    }

    & > .title {
      transform: translateY(2px);
      color: ${Colors.white};
    }
  }
`;
const IconList = withAttrs(
  { className: 'icon-list' },
  styled.div`
    margin-bottom: 8px;
    gap: 8px;
    display: flex;

    & > img {
      width: 72px;
    }
  `,
);

const LoadingContainer = styled(motion.div)`
  background-color: rgba(0, 56, 255, 0.45);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: all;
  cursor: default;
`;
