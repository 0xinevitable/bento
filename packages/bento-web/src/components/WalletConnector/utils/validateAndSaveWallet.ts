import { Base64 } from '@bento/common';
import { AxiosError } from 'axios';

import { Network } from '@/constants/networks';
import { axios } from '@/utils';

export const validateAndSaveWallet = async (
  params: (
    | {
        walletType: 'web3' | 'kaikas' | 'phantom';
        walletAddress: string;
        signature: string;
        nonce: string;
        networks: Network[];
      }
    | {
        walletType: 'keplr';
        walletAddress: string;
        signature: string;
        nonce: string;
        publicKeyValue: string;
        networks: Network[];
      }
  ) & { signOut: () => Promise<void> },
) => {
  const { walletType, walletAddress, signature, nonce, networks } = params;
  try {
    const { data } = await axios.post(`/api/auth/verify/${walletType}`, {
      walletAddress,
      signature,
      nonce: Base64.encode(nonce),
      ...(walletType === 'keplr' && {
        publicKeyValue: params.publicKeyValue,
      }),
      networks: Base64.encode(networks.map((v) => v.id).join(',')),
    });
    console.log({ data });
  } catch (error) {
    const maybeAxiosError = error as AxiosError;
    if (maybeAxiosError?.response?.status === 401) {
      await params.signOut();
    }
  }
};
