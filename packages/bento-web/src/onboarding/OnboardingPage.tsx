import { Base64 } from '@bento/core/lib/utils/Base64';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import axios from 'axios';
import Caver from 'caver-js';
import { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import Web3Modal from 'web3modal';

import { PageContainer } from '@/components/PageContainer';
import { FieldInput } from '@/profile/components/FieldInput';

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

const OnboardingPage: React.FC = () => {
  const messageToBeSigned = useMemo(
    () => 'Sign this message to add your wallet',
    [],
  ); // TODO: Add username and more

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
      const account = await signer.getAddress();
      const signature = await signer.signMessage(messageToBeSigned);

      await validateSignature({
        walletType: 'web3',
        walletAddress: account,
        signature,
        nonce: messageToBeSigned,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const connectKeplr = useCallback(async () => {
    if (typeof window.keplr === 'undefined') {
      window.alert('Please install keplr extension');
      return;
    }
    const chainId = 'cosmoshub-4';
    await window.keplr.enable(chainId);

    const offlineSigner = window.keplr.getOfflineSignerOnlyAmino(chainId);
    const accounts = await offlineSigner.getAccounts();
    const account = accounts[0].address;

    const { pub_key: publicKey, signature } = await window.keplr.signArbitrary(
      chainId,
      account,
      messageToBeSigned,
    );

    await validateSignature({
      walletType: 'keplr',
      walletAddress: account,
      signature,
      nonce: messageToBeSigned,
      publicKeyValue: publicKey.value,
    });
  }, []);

  const connectKaikas = useCallback(async () => {
    if (typeof window.klaytn === 'undefined') {
      window.alert('Please install kaikas extension');
      return;
    }

    try {
      const provider = window.klaytn;
      const accounts = await provider.enable();
      const account = accounts[0];

      const caver = new Caver(provider);
      const signature = await caver.rpc.klay.sign(account, messageToBeSigned);

      await validateSignature({
        walletType: 'kaikas',
        walletAddress: account,
        signature,
        nonce: messageToBeSigned,
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  const connectSolana = useCallback(async () => {
    if (typeof window.solana === 'undefined') {
      window.alert('Please install phantom extension');
      return;
    }

    const resp = await window.solana.connect();
    const account = resp.publicKey.toString();

    const encodedMessage = new TextEncoder().encode(messageToBeSigned);
    const signedMessage = await window.solana.signMessage(
      encodedMessage,
      'utf8',
    );

    const signature = Buffer.from(signedMessage.signature).toString('hex');

    await validateSignature({
      walletType: 'phantom',
      walletAddress: account,
      signature,
      nonce: messageToBeSigned,
    });
  }, []);

  return (
    <PageContainer>
      <FieldInput field="Username" />

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
    </PageContainer>
  );
};

export default OnboardingPage;

const Button = styled.button``;
