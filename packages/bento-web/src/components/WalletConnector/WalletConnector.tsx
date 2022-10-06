import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useSignOut } from '@/hooks/useSignOut';

import { WALLETS } from '@/constants/wallets';
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
  const firstNetwork = useMemo(() => {
    if (!networks || networks.length === 0) {
      return undefined;
    }
    return networks[0].type;
  }, [networks]);

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
    [isLoading, networks, signOut, onSave],
  );

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Button
        className={clsx(
          'p-4 text-slate-800 font-bold bg-slate-300',
          (firstNetwork !== 'evm' || isLoading) &&
            'opacity-20 cursor-not-allowed',
        )}
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
        MetaMask or WalletConnect
      </Button>

      <Button
        className={clsx(
          'p-4 text-slate-800 font-bold bg-slate-300',
          (firstNetwork !== 'evm' || isLoading) &&
            'opacity-20 cursor-not-allowed',
        )}
        onClick={
          firstNetwork === 'evm' && !isLoading
            ? () => onClickConnect('kaikas')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Kaikas} alt="Kaikas" />
        </IconList>
        Kaikas
      </Button>

      <Button
        className={clsx(
          'p-4 text-slate-800 font-bold bg-slate-300',
          (firstNetwork !== 'cosmos-sdk' || isLoading) &&
            'opacity-20 cursor-not-allowed',
        )}
        onClick={
          firstNetwork === 'cosmos-sdk' && !isLoading
            ? () => onClickConnect('keplr')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Keplr} alt="Keplr" />
        </IconList>
        Keplr
      </Button>

      <Button
        className={clsx(
          'p-4 text-slate-800 font-bold bg-slate-300',
          (firstNetwork !== 'solana' || isLoading) &&
            'opacity-20 cursor-not-allowed',
        )}
        onClick={
          firstNetwork === 'solana' && !isLoading
            ? () => onClickConnect('phantom')
            : undefined
        }
      >
        <IconList>
          <img src={WALLETS.Phantom} alt="Phantom" />
        </IconList>
        Phantom
      </Button>
    </div>
  );
};

const Button = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 8px;
  flex: 1;
  justify-content: center;

  &:first-of-type {
    min-width: 240px;
  }
`;
const IconList = styled.div`
  margin-bottom: 8px;
  gap: 8px;
  display: flex;

  & > img {
    width: 72px;
  }
`;
