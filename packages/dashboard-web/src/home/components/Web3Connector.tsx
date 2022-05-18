import { Web3Provider } from '@ethersproject/providers';
import React, { useCallback } from 'react';

import Web3Modal from 'web3modal';

const providerOptions = {};

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
