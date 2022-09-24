import { PostgrestError, PostgrestResponse } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

import { UserProfile } from '@/profile/types/UserProfile';
import { Supabase } from '@/utils';

type APIRequest = NextApiRequest & {
  body: UserProfile;
};

// FIXME: Soft delete next time

export default async (req: APIRequest, res: NextApiResponse) => {
  let {
    body: { walletAddress: _walletAddress },
  } = req;
  let walletAddress: string = _walletAddress as string;

  const { user } = await Supabase.auth.api.getUserByCookie(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const walletQuery = await Supabase.from('wallets') //
    .select('*')
    .eq('user_id', user.id)
    .eq('address', walletAddress);
  const [walletToDelete] = (walletQuery.data ?? []) as [any | undefined];

  let data: PostgrestResponse<any>;
  let error: PostgrestError | null = null;

  if (!!walletToDelete) {
    data = await Supabase.from('wallets').delete().match({
      address: walletToDelete.address,
      user_id: walletToDelete.user_id,
    });
    error = data.error;
  } else {
    res.status(401).json({ message: 'No wallet found' });
    return;
  }

  if (!!error) {
    res.status(500).json({ message: error.message });
    return;
  }

  return res.status(200).json(data);
};
