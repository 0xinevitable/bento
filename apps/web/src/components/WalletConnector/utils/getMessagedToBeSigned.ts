import axios from 'axios';

import { Config, toast } from '@/utils';

export const getMessagedToBeSigned = async (account: string) => {
  try {
    const {
      data: { nonce: messageToBeSigned },
    } = await axios.get<{ nonce: string }>(
      `${Config.MAIN_API_BASE_URL}/api/auth/nonce/${account.toLowerCase()}`,
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
