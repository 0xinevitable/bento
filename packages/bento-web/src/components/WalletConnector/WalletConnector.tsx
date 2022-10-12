import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { useSignOut } from '@/hooks/useSignOut';

import { WALLETS } from '@/constants/wallets';
import { Colors } from '@/styles';
import { toast } from '@/utils';

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
      } catch (error: any) {
        const typedError = error as Error;
        console.error(typedError);
        toast({
          type: 'error',
          title: 'Ownership Verification Failed',
          description: typedError?.message ?? undefined,
        });
      }

      setLoading(false);
    },
    [isLoading, networksJSONKey, signOut, onSave],
  );

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        disabled={firstNetwork !== 'evm' || isLoading}
        onClick={
          firstNetwork === 'evm' && !isLoading
            ? () => onClickConnect('metamask-or-walletconnect')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.MetaMask} alt="MetaMask" />
          <img src={WALLETS.WalletConnect} alt="WalletConnect" />
        </IconList>
        <span className="title">MetaMask or WalletConnect</span>
      </Button>

      <Button
        disabled={firstNetwork !== 'evm' || isLoading}
        onClick={
          firstNetwork === 'evm' && !isLoading
            ? () => onClickConnect('kaikas')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Kaikas} alt="Kaikas" />
        </IconList>
        <span className="title">Kaikas</span>
      </Button>

      <Button
        disabled={firstNetwork !== 'cosmos-sdk' || isLoading}
        onClick={
          firstNetwork === 'cosmos-sdk' && !isLoading
            ? () => onClickConnect('keplr')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Keplr} alt="Keplr" />
        </IconList>
        <span className="title">Keplr</span>
      </Button>

      <Button
        disabled={firstNetwork !== 'solana' || isLoading}
        onClick={
          firstNetwork === 'solana' && !isLoading
            ? () => onClickConnect('phantom')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Phantom} alt="Phantom" />
        </IconList>
        <span className="title">Phantom</span>
      </Button>
    </div>
  );
};

type ButtonProps = {
  disabled?: boolean;
};
const Button = styled.button<ButtonProps>`
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
const IconList = styled.div.attrs({
  className: 'icon-list',
})`
  margin-bottom: 8px;
  gap: 8px;
  display: flex;

  & > img {
    width: 72px;
  }
`;
