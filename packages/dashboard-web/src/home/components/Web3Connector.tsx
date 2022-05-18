import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useCallback } from 'react';

import Web3Modal from 'web3modal';

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

export const Web3Connector = () => {
  const onClickConnect = useCallback(async () => {
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

      console.log(await provider.listAccounts());
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <button className="text-slate-50/60" onClick={onClickConnect}>
      Connect Wallet
    </button>
  );
};
