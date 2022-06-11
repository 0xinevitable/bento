import { Wallet } from '@bento/types';
import { Base64 } from '@bento/utils/lib/Base64';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import axios from 'axios';
import produce from 'immer';
import { useCallback, useMemo } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import Web3Modal from 'web3modal';

import { walletsAtom } from '@/recoil/wallets';
import { toast } from '@/utils/toast';

declare global {
  interface Window {
    keplr: any;
    klaytn: any;
    solana: any;
  }
}

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

const validateSignature = async (
  params:
    | {
        walletType: 'web3' | 'kaikas' | 'phantom';
        walletAddress: string;
        signature: string;
        nonce: string;
      }
    | {
        walletType: 'keplr';
        walletAddress: string;
        signature: string;
        nonce: string;
        publicKeyValue: string;
      },
) => {
  const { walletType, walletAddress, signature, nonce } = params;
  const { data } = await axios.post(`/api/auth/verify/${walletType}`, {
    walletAddress,
    signature,
    nonce: Base64.encode(nonce),
    ...(walletType === 'keplr' && {
      publicKeyValue: params.publicKeyValue,
    }),
  });
  console.log({ data });
};

type WalletSelectorProps = {
  onSave?: () => void;
};
export const WalletConnector: React.FC<WalletSelectorProps> = ({ onSave }) => {
  const setWallets = useSetRecoilState(walletsAtom);

  const messageToBeSigned = useMemo(
    () => 'Sign this message to add your wallet',
    [],
  ); // TODO: Add username and more

  const saveWallet = useCallback(
    (params: {
      walletType: 'web3' | 'kaikas' | 'keplr' | 'phantom';
      walletAddress: string;
    }) => {
      const { walletType, walletAddress } = params;
      const draft =
        walletType === 'keplr'
          ? {
              type: 'cosmos-sdk',
              address: walletAddress,
              chains: ['cosmos-hub', 'osmosis'],
            }
          : walletType === 'phantom'
          ? {
              type: 'solana',
              address: walletAddress,
            }
          : {
              type: 'evm',
              address: walletAddress,
              chains: ['ethereum', 'polygon', 'klaytn'],
            };

      setWallets((prev) =>
        produce(prev, (walletsDraft) => {
          const index = walletsDraft.findIndex(
            (v) => v.address.toLowerCase() === draft.address.toLowerCase(),
          );
          if (index === -1) {
            walletsDraft.push(draft as Wallet);
          } else {
            const wallet = walletsDraft[index];
            if (wallet.type === 'solana') {
              return;
            }
            wallet.chains = Array.from(
              new Set([...draft.chains, ...wallet.chains]),
            ) as any[];
          }
        }),
      );
      onSave?.();
    },
    [onSave],
  );

  const connectMetaMask = useCallback(async () => {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions,
      theme: 'dark',
    });

    web3Modal.clearCachedProvider();

    try {
      const instance = await web3Modal.connect();
      const provider = new Web3Provider(instance);

      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      const signature = await signer.signMessage(messageToBeSigned);

      const walletType = 'web3';
      await validateSignature({
        walletType,
        walletAddress,
        signature,
        nonce: messageToBeSigned,
      });
      saveWallet({ walletType, walletAddress });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const connectKeplr = useCallback(async () => {
    if (typeof window.keplr === 'undefined') {
      toast({
        type: 'error',
        title: 'Please install keplr extension',
      });
      return;
    }

    try {
      const chainId = 'cosmoshub-4';
      await window.keplr.enable(chainId);

      const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(chainId);
      const accounts = await offlineSigner.getAccounts();
      const walletAddress = accounts[0].address;

      const { pub_key: publicKey, signature } =
        await window.keplr.signArbitrary(
          chainId,
          walletAddress,
          messageToBeSigned,
        );

      const walletType = 'keplr';
      await validateSignature({
        walletType,
        walletAddress,
        signature,
        nonce: messageToBeSigned,
        publicKeyValue: publicKey.value,
      });
      saveWallet({ walletType, walletAddress });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const connectKaikas = useCallback(async () => {
    if (typeof window.klaytn === 'undefined') {
      toast({
        type: 'error',
        title: 'Please install kaikas extension',
      });
      return;
    }

    try {
      const provider = window.klaytn;
      const accounts = await provider.enable();
      const walletAddress = accounts[0];

      const Caver = await import('caver-js');
      const caver = new Caver.default(provider);
      const signature = await caver.rpc.klay.sign(
        walletAddress,
        messageToBeSigned,
      );
      const walletType = 'kaikas';

      await validateSignature({
        walletType,
        walletAddress,
        signature,
        nonce: messageToBeSigned,
      });
      saveWallet({ walletType, walletAddress });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const connectSolana = useCallback(async () => {
    if (typeof window.solana === 'undefined') {
      toast({
        type: 'error',
        title: 'Please install phantom extension',
      });
      return;
    }

    const resp = await window.solana.connect();
    const walletAddress = resp.publicKey.toString();

    const encodedMessage = new TextEncoder().encode(messageToBeSigned);
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      'utf8',
    );

    const signature = Buffer.from(signedMessage.signature).toString('hex');

    const walletType = 'phantom';
    await validateSignature({
      walletType,
      walletAddress,
      signature,
      nonce: messageToBeSigned,
    });
    saveWallet({ walletType, walletAddress });
  }, []);

  return (
    <div className="flex gap-2">
      <Button
        className="p-4 text-slate-800 font-bold bg-slate-300"
        onClick={connectMetaMask}
      >
        MetaMask or WalletConnect
      </Button>

      <Button
        className="p-4 text-slate-800 font-bold bg-slate-300"
        onClick={connectKeplr}
      >
        Keplr
      </Button>

      <Button
        className="p-4 text-slate-800 font-bold bg-slate-300"
        onClick={connectKaikas}
      >
        Kaikas
      </Button>

      <Button
        className="p-4 text-slate-800 font-bold bg-slate-300"
        onClick={connectSolana}
      >
        Phantom
      </Button>
    </div>
  );
};

const Button = styled.button``;
