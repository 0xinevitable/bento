import { Analytics, toast } from '@/utils';

import { ConnectorProps } from '../types';
import { getMessagedToBeSigned } from '../utils/getMessagedToBeSigned';
import { validateAndSaveWallet } from '../utils/validateAndSaveWallet';

export const connectKeplr = async ({
  networks,
  signOut,
  onSave,
}: ConnectorProps) => {
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
  const account = accounts[0].address;
  const messageToBeSigned = await getMessagedToBeSigned(account);
  if (!messageToBeSigned) {
    return;
  }

  const { pub_key: publicKey, signature } = await window.keplr.signArbitrary(
    chainId,
    account,
    messageToBeSigned,
  );

  const walletType = 'keplr';
  await validateAndSaveWallet({
    networks,
    walletType,
    account,
    signature,
    nonce: messageToBeSigned,
    publicKeyValue: publicKey.value,
    signOut,
  }).then(() => {
    Analytics.logEvent('connect_wallet', {
      type: 'keplr',
      networks: networks.map((v) => v.id) as any[],
      address: account,
    });
  });

  onSave?.();
};
