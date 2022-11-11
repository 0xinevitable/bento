import { Analytics } from '@/utils';

import { ConnectorProps } from '../types';
import { getMessagedToBeSigned } from '../utils/getMessagedToBeSigned';
import { validateAndSaveWallet } from '../utils/validateAndSaveWallet';

export const connectMetaMaskOrWalletConnect = async ({
  networks,
  signOut,
  onSave,
}: ConnectorProps) => {
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
  const account = await signer.getAddress();
  const messageToBeSigned = await getMessagedToBeSigned(account);
  if (!messageToBeSigned) {
    return;
  }
  const signature = await signer.signMessage(messageToBeSigned);

  const walletType = 'web3';
  await validateAndSaveWallet({
    networks,
    walletType,
    account,
    signature,
    nonce: messageToBeSigned,
    signOut,
  }).then(() => {
    Analytics.logEvent('connect_wallet', {
      type: 'metamask-or-walletconnect',
      networks: networks.map((v) => v.id) as any[],
      address: account,
    });
  });

  onSave?.();
};
