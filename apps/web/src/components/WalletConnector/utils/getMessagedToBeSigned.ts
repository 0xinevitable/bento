import { axiosWithCredentials } from '@/utils';
import { toast } from '@/utils';

export const getMessagedToBeSigned = async (account: string) => {
  try {
    const {
      data: { nonce: messageToBeSigned },
    } = await axiosWithCredentials.get<{ nonce: string }>(
      `/api/auth/nonce/${account}`,
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
