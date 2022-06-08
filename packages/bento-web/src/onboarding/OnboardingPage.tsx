import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Caver from 'caver-js';
import { useCallback } from 'react';
import styled from 'styled-components';
import Web3Modal from 'web3modal';

import { PageContainer } from '@/components/PageContainer';
import { FieldInput } from '@/profile/components/FieldInput';

declare global {
  interface Window {
    keplr: any;
    klaytn: any;
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

const OnboardingPage: React.FC = () => {
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
      const nonce = 'waka';
      const signature = await signer.signMessage(nonce);
      console.log({ account, signature });
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
      'waka',
    );
    console.log({ publicKey, signature, account });
  }, []);

  const connectKaikas = useCallback(async () => {
    if (typeof window.klaytn === 'undefined') {
      window.alert('Please install kaikas extension');
      return;
    }

    const provider = window.klaytn;
    const accounts = await provider.enable();
    const account = accounts[0];

    const caver = new Caver(provider);
    const signature = await caver.rpc.klay.sign(account, 'waka');
    console.log({ signature });
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
      </div>
    </PageContainer>
  );
};

export default OnboardingPage;

const Button = styled.button``;
