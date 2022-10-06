import { Base64 } from '@bento/common';
import { cachedAxios } from '@bento/core';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useSignOut } from '@/hooks/useSignOut';

import { Network } from '@/constants/networks';
import { WALLETS } from '@/constants/wallets';
import { Analytics, toast } from '@/utils';

declare global {
  interface Window {
    keplr: any;
    klaytn: any;
    solana: any;
  }
}

const getMessagedToBeSigned = async (walletAddress: string) => {
  try {
    const {
      data: { nonce: messageToBeSigned },
    } = await axios.get<{ nonce: string }>(
      `/api/auth/nonce/${walletAddress.toLowerCase()}`,
    );
    return messageToBeSigned;
  } catch (error) {
    console.error(error);
    toast({
      type: 'error',
      title: 'Failed to get nonce',
    });
  }
};

const validateAndSaveWallet = async (
  params: (
    | {
        walletType: 'web3' | 'kaikas' | 'phantom';
        walletAddress: string;
        signature: string;
        nonce: string;
        networks: Network[];
      }
    | {
        walletType: 'keplr';
        walletAddress: string;
        signature: string;
        nonce: string;
        publicKeyValue: string;
        networks: Network[];
      }
  ) & { signOut: () => Promise<void> },
) => {
  const { walletType, walletAddress, signature, nonce, networks } = params;
  try {
    const { data } = await cachedAxios.post(`/api/auth/verify/${walletType}`, {
      walletAddress,
      signature,
      nonce: Base64.encode(nonce),
      ...(walletType === 'keplr' && {
        publicKeyValue: params.publicKeyValue,
      }),
      networks: Base64.encode(networks.map((v) => v.id).join(',')),
    });
    console.log({ data });
  } catch (error) {
    const maybeAxiosError = error as AxiosError;
    if (maybeAxiosError?.response?.status === 401) {
      await params.signOut();
    }
  }
};

type WalletSelectorProps = {
  networks?: {
    id: string;
    type: string;
    name: string;
    logo: string;
  }[];
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
    (firstNetwork: string) => {
      if (isLoading) {
        return;
      }

      const connectWeb3 = async () => {
        if (!networks) {
          return;
        }

        Analytics.logEvent('click_connect_wallet_select_wallet', {
          type: 'metamask-or-walletconnect',
        });

        const [
          { default: Web3Modal },
          { default: WalletConnectProvider },
          { Web3Provider },
        ] = await Promise.all([
          import('web3modal'),
          import('@walletconnect/web3-provider'),
          import('@ethersproject/providers'),
        ]);

        const providerOptions = {
          injected: {
            display: {
              name: 'Metamask',
              description: 'Connect with MetaMask',
            },
            package: null,
          },
          walletconnect: {
            display: {
              name: 'WalletConnect',
              description: 'Connect with WalletConnect',
            },
            package: WalletConnectProvider,
            options: {
              infuraId: 'fcb656a7b4d14c9f9b0803a5d7475877',
            },
          },
        };

        const web3Modal = new Web3Modal({
          network: 'mainnet',
          cacheProvider: true,
          providerOptions,
          theme: 'dark',
        });

        web3Modal.clearCachedProvider();

        const instance = await web3Modal.connect();
        const provider = new Web3Provider(instance);

        const signer = provider.getSigner();
        const walletAddress = await signer.getAddress();
        const messageToBeSigned = await getMessagedToBeSigned(walletAddress);
        if (!messageToBeSigned) {
          return;
        }
        const signature = await signer.signMessage(messageToBeSigned);

        const walletType = 'web3';
        await validateAndSaveWallet({
          networks,
          walletType,
          walletAddress,
          signature,
          nonce: messageToBeSigned,
          signOut,
        }).then(() => {
          Analytics.logEvent('connect_wallet', {
            type: 'metamask-or-walletconnect',
            networks: networks.map((v) => v.id) as any[],
            address: walletAddress,
          });
        });

        onSave?.();
      };

      const connectKeplr = async () => {
        if (!networks) {
          return;
        }

        Analytics.logEvent('click_connect_wallet_select_wallet', {
          type: 'keplr',
        });

        if (typeof window.keplr === 'undefined') {
          toast({
            type: 'error',
            title: 'Please install keplr extension',
          });
          return;
        }

        const chainId = 'cosmoshub-4';
        await window.keplr.enable(chainId);

        const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(chainId);
        const accounts = await offlineSigner.getAccounts();
        const walletAddress = accounts[0].address;
        const messageToBeSigned = await getMessagedToBeSigned(walletAddress);
        if (!messageToBeSigned) {
          return;
        }

        const { pub_key: publicKey, signature } =
          await window.keplr.signArbitrary(
            chainId,
            walletAddress,
            messageToBeSigned,
          );

        const walletType = 'keplr';
        await validateAndSaveWallet({
          networks,
          walletType,
          walletAddress,
          signature,
          nonce: messageToBeSigned,
          publicKeyValue: publicKey.value,
          signOut,
        }).then(() => {
          Analytics.logEvent('connect_wallet', {
            type: 'keplr',
            networks: networks.map((v) => v.id) as any[],
            address: walletAddress,
          });
        });

        onSave?.();
      };

      const connectKaikas = async () => {
        if (!networks) {
          return;
        }

        Analytics.logEvent('click_connect_wallet_select_wallet', {
          type: 'kaikas',
        });

        if (typeof window.klaytn === 'undefined') {
          toast({
            type: 'error',
            title: 'Please install kaikas extension',
          });
          return;
        }

        const provider = window.klaytn;
        const accounts = await provider.enable();
        const walletAddress = accounts[0];
        const messageToBeSigned = await getMessagedToBeSigned(walletAddress);
        if (!messageToBeSigned) {
          return;
        }

        const Caver = await import('caver-js');
        const caver = new Caver.default(provider);
        const signature = await caver.rpc.klay.sign(
          walletAddress,
          messageToBeSigned,
        );
        const walletType = 'kaikas';

        await validateAndSaveWallet({
          networks,
          walletType,
          walletAddress,
          signature,
          nonce: messageToBeSigned,
          signOut,
        }).then(() => {
          Analytics.logEvent('connect_wallet', {
            type: 'kaikas',
            networks: networks.map((v) => v.id) as any[],
            address: walletAddress,
          });
        });

        onSave?.();
      };

      const connectPhantom = async () => {
        if (!networks) {
          return;
        }

        Analytics.logEvent('click_connect_wallet_select_wallet', {
          type: 'phantom',
        });

        if (typeof window.solana === 'undefined') {
          toast({
            type: 'error',
            title: 'Please install phantom extension',
          });
          return;
        }

        const resp = await window.solana.connect();
        const walletAddress = resp.publicKey.toString();
        const messageToBeSigned = await getMessagedToBeSigned(walletAddress);
        if (!messageToBeSigned) {
          return;
        }

        const encodedMessage = new TextEncoder().encode(messageToBeSigned);
        const signedMessage = await window.solana.signMessage(
          encodedMessage,
          'utf8',
        );

        const signature = Buffer.from(signedMessage.signature).toString('hex');

        const walletType = 'phantom';
        await validateAndSaveWallet({
          networks,
          walletType,
          walletAddress,
          signature,
          nonce: messageToBeSigned,
          signOut,
        }).then(() => {
          Analytics.logEvent('connect_wallet', {
            type: 'phantom',
            networks: networks.map((v) => v.id) as any[],
            address: walletAddress,
          });
        });

        onSave?.();
      };

      setLoading(true);

      try {
        switch (firstNetwork) {
          case 'web3':
            connectWeb3();
            break;
          case 'keplr':
            connectKeplr();
            break;
          case 'kaikas':
            connectKaikas();
            break;
          case 'phantom':
            connectPhantom();
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
    [networks, onSave],
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
            ? () => onClickConnect(firstNetwork)
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
            ? () => onClickConnect(firstNetwork)
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
            ? () => onClickConnect(firstNetwork)
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
            ? () => onClickConnect(firstNetwork)
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
