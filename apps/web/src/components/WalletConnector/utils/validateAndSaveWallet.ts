import { Base64 } from '@bento/common';
import { AxiosError } from 'axios';

import { Network } from '@/constants/networks';
import { axiosWithCredentials } from '@/utils';

export const validateAndSaveWallet = async (
  params: (
    | {
        walletType: 'web3' | 'kaikas' | 'phantom';
        account: string;
        signature: string;
        nonce: string;
        networks: Network[];
      }
    | {
        walletType: 'keplr';
        account: string;
        signature: string;
        nonce: string;
        publicKeyValue: string;
        networks: Network[];
      }
  ) & { signOut: () => Promise<void> },
) => {
  const { walletType, account, signature, nonce, networks } = params;
  try {
    const { data } = await axiosWithCredentials.post(
      `/api/auth/verify/${walletType}`,
      {
        account,
        signature,
        nonce: Base64.encode(nonce),
        ...(walletType === 'keplr' && {
          publicKeyValue: params.publicKeyValue,
        }),
        networks: Base64.encode(networks.map((v) => v.id).join(',')),
      },
    );
    console.log({ data });
  } catch (error) {
    const maybeAxiosError = error as AxiosError;
    if (maybeAxiosError?.response?.status === 401) {
      await params.signOut();
    }
  }
};
