import axios from 'axios';

import { toast } from '@/utils';

export const getMessagedToBeSigned = async (walletAddress: string) => {
  try {
    const {
      data: { nonce: messageToBeSigned },
    } = await axios.get<{ nonce: string }>(
      `/api/auth/nonce/${walletAddress.toLowerCase()}`,
    );
    return messageToBeSigned;
  } catch (error) {
    console.error(error);
    toast({
      type: 'error',
      title: 'Failed to get nonce',
    });
  }
};
