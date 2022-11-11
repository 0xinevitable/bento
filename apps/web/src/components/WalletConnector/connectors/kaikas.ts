import { Analytics, toast } from '@/utils';

import { ConnectorProps } from '../types';
import { getMessagedToBeSigned } from '../utils/getMessagedToBeSigned';
import { validateAndSaveWallet } from '../utils/validateAndSaveWallet';

export const connectKaikas = async ({
  networks,
  signOut,
  onSave,
}: ConnectorProps) => {
  Analytics.logEvent('click_connect_wallet_select_wallet', {
    type: 'kaikas',
  });

  if (typeof window.klaytn === 'undefined') {
    toast({
      type: 'error',
      title: 'Please install Kaikas extension',
    });
    return;
  }

  const provider = window.klaytn;
  const accounts = await provider.enable();
  const account = accounts[0];
  const messageToBeSigned = await getMessagedToBeSigned(account);
  if (!messageToBeSigned) {
    return;
  }

  const Caver = await import('caver-js');
  const caver = new Caver.default(provider);
  const signature = await caver.rpc.klay.sign(account, messageToBeSigned);
  const walletType = 'kaikas';

  await validateAndSaveWallet({
    networks,
    walletType,
    account,
    signature,
    nonce: messageToBeSigned,
    signOut,
  }).then(() => {
    Analytics.logEvent('connect_wallet', {
      type: 'kaikas',
      networks: networks.map((v) => v.id) as any[],
      address: account,
    });
  });

  onSave?.();
};
