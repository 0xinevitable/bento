import { Analytics, toast } from '@/utils';

import { ConnectorProps } from '../types';
import { getMessagedToBeSigned } from '../utils/getMessagedToBeSigned';
import { validateAndSaveWallet } from '../utils/validateAndSaveWallet';

export const connectPhantom = async ({
  networks,
  signOut,
  onSave,
}: ConnectorProps) => {
  Analytics.logEvent('click_connect_wallet_select_wallet', {
    type: 'phantom',
  });

  if (typeof window.solana === 'undefined') {
    toast({
      type: 'error',
      title: 'Please install Phantom extension',
    });
    return;
  }

  const resp = await window.solana.connect();
  const account = resp.publicKey.toString();
  const messageToBeSigned = await getMessagedToBeSigned(account);
  if (!messageToBeSigned) {
    return;
  }

  const encodedMessage = new TextEncoder().encode(messageToBeSigned);
  const signedMessage = await window.solana.signMessage(encodedMessage, 'utf8');

  const signature = Buffer.from(signedMessage.signature).toString('hex');

  const walletType = 'phantom';
  await validateAndSaveWallet({
    networks,
    walletType,
    account,
    signature,
    nonce: messageToBeSigned,
    signOut,
  }).then(() => {
    Analytics.logEvent('connect_wallet', {
      type: 'phantom',
      networks: networks.map((v) => v.id) as any[],
      address: account,
    });
  });

  onSave?.();
};
