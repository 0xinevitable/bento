import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import React, { useCallback } from 'react';

import Web3Modal from 'web3modal';

const providerOptions = {
  injected: {
    display: {
      logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
      name: 'Injected',
      description: 'Connect with the provider in your Browser',
    },
    package: null,
  },
  // Example with WalletConnect provider
  walletconnect: {
    display: {
      logo: 'data:image/gif;base64,INSERT_BASE64_STRING',
      name: 'Mobile',
      description: 'Scan qrcode with your mobile wallet',
    },
    package: WalletConnectProvider,
    options: {
      infuraId: 'INFURA_ID', // required
    },
  },
};

export const Web3Connector = () => {
  const onClick = useCallback(async () => {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: true,
      providerOptions,
    });

    const instance = await web3Modal.connect();
    const provider = new Web3Provider(instance);

    console.log(await provider.listAccounts());
  }, []);

  return <button onClick={onClick}>Connect Wallet</button>;
};
