import { Wallet } from '@bento/core/lib/types';
import { Web3Provider } from '@ethersproject/providers';
import WalletConnectProvider from '@walletconnect/web3-provider';
import produce from 'immer';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Web3Modal from 'web3modal';

import { walletsAtom } from '@/recoil/wallets';

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
  const [wallets, setWallets] = useRecoilState(walletsAtom);

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

      const accounts = await provider.listAccounts();
      const firstAddress = accounts[0];
      window.alert(firstAddress);

      const draft = {
        type: 'evm',
        address: firstAddress,
        chains: ['ethereum', 'polygon', 'klaytn'],
      };

      // 이미 있는 지갑을 추가한 경우, 체인만 업데이트
      const duplicatedWallet = wallets.find(
        (v) => v.address.toLowerCase() === draft.address.toLowerCase(),
      );
      if (duplicatedWallet) {
        setWallets((prev) =>
          produce(prev, (walletsDraft) => {
            walletsDraft.forEach((wallet) => {
              if (
                wallet.address === draft.address &&
                wallet.type !== 'solana'
              ) {
                wallet.chains = Array.from(
                  new Set([...(draft.chains as any), ...wallet.chains]),
                );
              }
            });
          }),
        );
        return;
      }

      setWallets((prev) => [...prev, draft as Wallet]);
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
